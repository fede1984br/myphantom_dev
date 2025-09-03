import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";

// Initialize Firebase Admin SDK
admin.initializeApp();

const app = express();
app.use(express.json());

// A simple health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Integrations service is up and running." });
});

// Example route for a specific integration
app.post("/webhook", (req, res) => {
    const payload = req.body;
    // In a real app, you would process the webhook payload here
    console.log("Received webhook payload:", payload);
    res.status(200).json({ status: "received" });
});


// Expose the Express app as a Cloud Function named "api"
// The resulting URL will be something like:
// https://<region>-<project-id>.cloudfunctions.net/integrations-api
export const api = functions.https.onRequest(app);
