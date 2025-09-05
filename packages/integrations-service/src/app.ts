import express from "express";
import * as admin from "firebase-admin";
import { google } from "googleapis";
import * as jwt from "jsonwebtoken";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { ChatMessage } from "@my-phantom/core/models";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const app = express();
app.use(express.json());

const secretManagerClient = new SecretManagerServiceClient();
const projectId = process.env.GCLOUD_PROJECT || 'myphantomdev';

// --- Helper Functions ---

let serviceAccountKey: any;
async function getServiceAccountKey() {
    if (serviceAccountKey) return serviceAccountKey;
    const [version] = await secretManagerClient.accessSecretVersion({
        name: `projects/${projectId}/secrets/gemini-live-service-account-key/versions/latest`,
    });
    const payload = version.payload?.data?.toString();
    if (!payload) throw new Error("Could not retrieve service account key.");
    serviceAccountKey = JSON.parse(payload);
    return serviceAccountKey;
}

let oauth2ClientInstance: any;
async function getOAuth2Client() {
    if (oauth2ClientInstance) return oauth2ClientInstance;
    const [clientIdVersion] = await secretManagerClient.accessSecretVersion({
        name: `projects/${projectId}/secrets/GOOGLE_OAUTH_CLIENT_ID/versions/latest`,
    });
    const clientId = clientIdVersion.payload?.data?.toString();
    const [clientSecretVersion] = await secretManagerClient.accessSecretVersion({
        name: `projects/${projectId}/secrets/GOOGLE_OAUTH_CLIENT_SECRET/versions/latest`,
    });
    const clientSecret = clientSecretVersion.payload?.data?.toString();
    if (!clientId || !clientSecret) {
        throw new Error("Could not retrieve OAuth credentials from Secret Manager.");
    }
    oauth2ClientInstance = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost:3000/oauth-callback');
    return oauth2ClientInstance;
}

// --- API Endpoints ---

app.get("/", (req, res) => res.status(200).json({ message: "Integrations service is up and running." }));

app.post("/generate-gemini-token", async (req, res) => {
    try {
        const { sessionId, userId } = req.body;
        if (!sessionId || !userId) {
            return res.status(400).json({ error: "sessionId and userId are required in the request body." });
        }
        const key = await getServiceAccountKey();
        const now = Math.floor(Date.now() / 1000);
        const expiry = now + 3600;
        const claims = { iss: key.client_email, sub: key.client_email, aud: "https://generativelanguage.googleapis.com/", iat: now, exp: expiry, session_id: sessionId, user_id: userId };
        const token = jwt.sign(claims, key.private_key, { algorithm: 'RS256' });
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error generating Gemini Live token:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        res.status(500).json({ error: "Failed to generate token.", details: errorMessage });
    }
});

app.post("/google-oauth-callback", async (req, res) => {
    try {
        const { code, userId } = req.body;
        if (!code || !userId) {
            return res.status(400).json({ error: "Authorization code and userId are required." });
        }
        const oauthClient = await getOAuth2Client();
        const { tokens } = await oauthClient.getToken(code);
        if (tokens.refresh_token) {
            const userRef = admin.firestore().collection('users').doc(userId);
            await userRef.update({ googleRefreshToken: tokens.refresh_token });
        }
        res.status(200).json({ message: "Successfully connected Google account." });
    } catch (error) {
        console.error("Error in Google OAuth callback:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        res.status(500).json({ error: "Failed to process OAuth callback.", details: errorMessage });
    }
});

app.get("/classroom/courses", async (req, res) => {
    try {
        const userId = req.query.userId as string;
        if (!userId) {
            return res.status(400).json({ error: "userId query parameter is required." });
        }
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists || !userDoc.data()?.googleRefreshToken) {
            return res.status(403).json({ error: "User has not connected their Google account or does not exist." });
        }
        const oauthClient = await getOAuth2Client();
        oauthClient.setCredentials({ refresh_token: userDoc.data()?.googleRefreshToken });
        const classroom = google.classroom({ version: 'v1', auth: oauthClient });
        const courseList = await classroom.courses.list();
        res.status(200).json(courseList.data.courses || []);
    } catch (error) {
        console.error("Error listing Google Classroom courses:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        res.status(500).json({ error: "Failed to list courses.", details: errorMessage });
    }
});

export { app };
