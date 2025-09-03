import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";

// Initialize Firebase Admin SDK
admin.initializeApp();

const app = express();
app.use(express.json());

// A simple health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Users service is up and running." });
});

// Example route for users
app.get("/:id", (req, res) => {
    const userId = req.params.id;
    // In a real app, you would fetch user data from a database
    res.status(200).json({ id: userId, name: `User ${userId}` });
});


// Expose the Express app as a Cloud Function named "api"
// The resulting URL will be something like:
// https://<region>-<project-id>.cloudfunctions.net/users-api
export const api = functions.https.onRequest(app);
