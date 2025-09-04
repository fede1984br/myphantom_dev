import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import { ChatMessage } from "@my-phantom/core/models";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import * as jwt from "jsonwebtoken";
import { google } from "googleapis";


// Safely initialize the Firebase Admin SDK to prevent re-initialization
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const app = express();
app.use(express.json());

const secretManagerClient = new SecretManagerServiceClient();
const projectId = process.env.GCLOUD_PROJECT || 'myphantomdev';

// --- Helper Functions for Secrets and Clients ---

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

    oauth2ClientInstance = new google.auth.OAuth2(
        clientId,
        clientSecret,
        'http://localhost:3000/oauth-callback' // This must match a redirect URI in your GCP credentials
    );
    return oauth2ClientInstance;
}

// --- API Endpoints ---

app.get("/", (req, res) => res.status(200).json({ message: "Integrations service is up and running." }));


app.post("/webhook", (req, res) => {
    const payload = req.body;
    const message: Partial<ChatMessage> = {
        text: `Received webhook with message: ${payload.message}`,
        sentAt: admin.firestore.Timestamp.now(),
        sentBy: 'phantom',
        userId: payload.userId,
    };
    console.log("Received and processed webhook into ChatMessage:", message);
    res.status(200).json({ status: "received", processedMessage: message });
});


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
        if (!tokens.refresh_token) {
            return res.status(200).json({ message: "Authorization successful, no new refresh token issued." });
        }
        const userRef = admin.firestore().collection('users').doc(userId);
        await userRef.update({ googleRefreshToken: tokens.refresh_token });
        res.status(200).json({ message: "Successfully connected Google account." });
    } catch (error) {
        console.error("Error in Google OAuth callback:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        res.status(500).json({ error: "Failed to process OAuth callback.", details: errorMessage });
    }
});

// New endpoint to list Google Classroom courses
app.get("/classroom/courses", async (req, res) => {
    try {
        // TODO: In a real app, get the userId from a verified Firebase Auth ID token, not a query param.
        const userId = req.query.userId as string;
        if (!userId) {
            return res.status(400).json({ error: "userId query parameter is required." });
        }

        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found." });
        }

        const refreshToken = userDoc.data()?.googleRefreshToken;
        if (!refreshToken) {
            return res.status(403).json({ error: "User has not connected their Google account." });
        }

        const oauthClient = await getOAuth2Client();
        oauthClient.setCredentials({ refresh_token: refreshToken });

        const classroom = google.classroom({ version: 'v1', auth: oauthClient });
        const courseList = await classroom.courses.list();

        res.status(200).json(courseList.data.courses || []);

    } catch (error) {
        console.error("Error listing Google Classroom courses:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        res.status(500).json({ error: "Failed to list courses.", details: errorMessage });
    }
});

// Expose the Express app as a Cloud Function

export const api = functions.https.onRequest(app);
