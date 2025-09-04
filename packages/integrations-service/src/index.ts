import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import { ChatMessage } from "@my-phantom/core/models";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import * as jwt from "jsonwebtoken";

// Safely initialize the Firebase Admin SDK to prevent re-initialization
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const app = express();
app.use(express.json());

const secretManagerClient = new SecretManagerServiceClient();
const projectId = process.env.GCLOUD_PROJECT || 'myphantomdev';
const secretName = 'gemini-live-service-account-key';

let serviceAccountKey: any;

// Helper function to get the service account key, with in-memory caching.
async function getServiceAccountKey() {
    if (serviceAccountKey) {
        return serviceAccountKey;
    }
    const [version] = await secretManagerClient.accessSecretVersion({
        name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
    });
    const payload = version.payload?.data?.toString();
    if (!payload) {
        throw new Error("Could not retrieve service account key from Secret Manager.");
    }
    serviceAccountKey = JSON.parse(payload);
    return serviceAccountKey;
}


// A simple health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Integrations service is up and running." });
});

// Example route for a webhook that might create a ChatMessage
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

// New endpoint to generate ephemeral tokens for Gemini Live
app.post("/generate-gemini-token", async (req, res) => {
    try {
        const { sessionId, userId } = req.body;
        if (!sessionId || !userId) {
            return res.status(400).json({ error: "sessionId and userId are required in the request body." });
        }

        const key = await getServiceAccountKey();
        const now = Math.floor(Date.now() / 1000);
        const expiry = now + 3600; // Token is valid for 1 hour

        // Standard claims for Google API authentication via JWT
        const claims = {
            iss: key.client_email,
            sub: key.client_email,
            aud: "https://generativelanguage.googleapis.com/",
            iat: now,
            exp: expiry,
            // Custom claims for your application's use
            session_id: sessionId,
            user_id: userId,
        };

        const token = jwt.sign(claims, key.private_key, { algorithm: 'RS256' });

        res.status(200).json({ token });

    } catch (error) {
        console.error("Error generating Gemini Live token:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        res.status(500).json({ error: "Failed to generate token.", details: errorMessage });
    }
});


// Expose the Express app as a Cloud Function named "api"
// This groups all the app's routes under a single function.
export const api = functions.https.onRequest(app);
