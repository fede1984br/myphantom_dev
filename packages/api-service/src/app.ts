import express, { Request, Response, Application } from "express";
import * as admin from "firebase-admin";
import { google } from "googleapis";
import * as jwt from "jsonwebtoken";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { Student } from "@my-phantom/core";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

const usersApp: Application = express();
usersApp.use(express.json());

const integrationsApp: Application = express();
integrationsApp.use(express.json());

const usersRouter = express.Router();

usersRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Users service is up and running." });
});

usersRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const studentProfile = await getStudentProfile(userId);
    if (!studentProfile) {
      return res.status(404).json({ message: "Student not found." });
    }
    return res.status(200).json(studentProfile);
  } catch (error) {
    console.error(`Error fetching profile for user ${req.params.id}:`, error);
    return res.status(500).json({ message: "Internal server error while fetching profile." });
  }
});

usersApp.use('/', usersRouter);

const integrationsRouter = express.Router();

const secretManagerClient = new SecretManagerServiceClient();
const projectId = process.env.GCLOUD_PROJECT || 'myphantomdev';

let serviceAccountKey: any;
async function getServiceAccountKey() {
    if (serviceAccountKey) return serviceAccountKey;
    try {
        const [version] = await secretManagerClient.accessSecretVersion({
            name: `projects/${projectId}/secrets/gemini-live-service-account-key/versions/latest`,
        });
        const payload = version.payload?.data?.toString();
        if (!payload) throw new Error("Could not retrieve service account key.");
        serviceAccountKey = JSON.parse(payload);
        return serviceAccountKey;
    } catch (error) {
        console.error("Failed to access secret: gemini-live-service-account-key", error);
        throw new Error("Failed to access secret: gemini-live-service-account-key. Check logs for details.");
    }
}

let oauth2ClientInstance: any;
async function getOAuth2Client() {
    if (oauth2ClientInstance) return oauth2ClientInstance;
    let clientId, clientSecret;
    try {
        const [clientIdVersion] = await secretManagerClient.accessSecretVersion({
            name: `projects/${projectId}/secrets/GOOGLE_OAUTH_CLIENT_ID/versions/latest`,
        });
        clientId = clientIdVersion.payload?.data?.toString();
    } catch (error) {
        console.error("Failed to access secret: GOOGLE_OAUTH_CLIENT_ID", error);
        throw new Error("Failed to access secret: GOOGLE_OAUTH_CLIENT_ID. Check logs for details.");
    }

    try {
        const [clientSecretVersion] = await secretManagerClient.accessSecretVersion({
            name: `projects/${projectId}/secrets/GOOGLE_OAUTH_CLIENT_SECRET/versions/latest`,
        });
        clientSecret = clientSecretVersion.payload?.data?.toString();
    } catch (error) {
        console.error("Failed to access secret: GOOGLE_OAUTH_CLIENT_SECRET", error);
        throw new Error("Failed to access secret: GOOGLE_OAUTH_CLIENT_SECRET. Check logs for details.");
    }

    if (!clientId || !clientSecret) {
        throw new Error("Could not retrieve OAuth credentials from Secret Manager.");
    }
    oauth2ClientInstance = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost:3000/oauth-callback');

    return oauth2ClientInstance;
}

async function getStudentProfile(uid: string): Promise<Student | null> {
  const userRef = db.collection('users').doc(uid);
  const profileRef = db.collection('student_profiles').doc(uid);

  try {
    const [userDoc, profileDoc] = await Promise.all([
      userRef.get(),
      profileRef.get()
    ]);

    if (!userDoc.exists) {
      console.error(`No user found for UID: ${uid}`);
      return null;
    }

    const userData = userDoc.data() as Omit<Student, 'id'>;
    const profileData = profileDoc.exists ? profileDoc.data() : {};

    const fullProfile: Student = {
      id: uid,
      ...userData,
      ...profileData
    };

    return fullProfile;

  } catch (error) {
    console.error("Error fetching student profile:", error);
    return null;
  }
}

integrationsRouter.get("/", (req: Request, res: Response) => res.status(200).json({ message: "Integrations service is up and running." }));

integrationsRouter.post("/generate-gemini-token", async (req: Request, res: Response) => {

    try {
        const { sessionId, userId } = req.body;
        if (!sessionId || !userId) {
            return res.status(400).json({ error: "sessionId and userId are required in the request body." });
        }
        const key = await getServiceAccountKey();
        const now = Math.floor(Date.now() / 1000);
        const expiry = now + 3600;
        const claims = { iss: key.client_email, sub: key.client_email, aud: "https://generativelanguage.googleapis.com/", iat: now, exp: expiry, session_id: sessionId, user_id: userId };
        const token = jwt.sign(claims, key.jwt_secret, { algorithm: 'HS256' });
        return res.status(200).json({ token });
    } catch (error) {
        console.error("Error generating Gemini Live token:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Failed to generate token.", details: errorMessage });
    }
});

integrationsRouter.post("/google-oauth-callback", async (req: Request, res: Response) => {

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

        return res.status(200).json({ message: "Successfully connected Google account." });
    } catch (error) {
        console.error("Error in Google OAuth callback:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Failed to process OAuth callback.", details: errorMessage });
    }
});

integrationsRouter.get("/classroom/courses", async (req: Request, res: Response) => {

    try {
        const userId = req.query.userId as string;
        if (!userId) {
            return res.status(400).json({ error: "userId query parameter is required." });
        }
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }
        const userData = userDoc.data();
        if (!userData?.googleRefreshToken) {
            return res.status(403).json({ error: "User has not connected their Google account" });
        }
        const oauthClient = await getOAuth2Client();
        oauthClient.setCredentials({ refresh_token: userData.googleRefreshToken });

        const classroom = google.classroom({ version: 'v1', auth: oauthClient });
        const courseList = await classroom.courses.list();
        return res.status(200).json(courseList.data.courses || []);
    } catch (error) {
        console.error("Error listing Google Classroom courses:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Failed to list courses.", details: errorMessage });
    }
});

integrationsApp.use('/', integrationsRouter);

export { usersApp, integrationsApp };