import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import { User } from "@my-phantom/core/models";

// Safely initialize the Firebase Admin SDK to prevent re-initialization
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const app = express();
app.use(express.json());

// A simple health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Users service is up and running." });
});

// Example route for fetching a user, demonstrating the use of the User model
app.get("/:id", (req, res) => {
    const userId = req.params.id;
    // In a real app, you would fetch user data from Firestore like so:
    // const userDoc = await admin.firestore().collection('users').doc(userId).get();
    // const userData = userDoc.data() as User;

    // For now, we'll return a mock User object that conforms to the User interface
    const mockUser: User = {
        id: userId,
        email: `user.${userId}@example.com`,
        displayName: `User ${userId}`,
        createdAt: admin.firestore.Timestamp.now(),
    };
    res.status(200).json(mockUser);
});


// Expose the Express app as a Cloud Function named "api"
// This groups all the app's routes under a single function.
export const api = functions.https.onRequest(app);
