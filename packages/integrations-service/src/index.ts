import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import { ChatMessage } from "@my-phantom/core/models";

// Safely initialize the Firebase Admin SDK to prevent re-initialization
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const app = express();
app.use(express.json());

// A simple health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Integrations service is up and running." });
});

// Example route for a webhook that might create a ChatMessage
app.post("/webhook", (req, res) => {
    const payload = req.body;

    // In a real app, you might receive a message from a third-party service
    // and transform it into our ChatMessage format to save in Firestore.
    const message: Partial<ChatMessage> = {
        text: `Received webhook with message: ${payload.message}`,
        sentAt: admin.firestore.Timestamp.now(),
        sentBy: 'phantom', // This message is from an automated integration
        userId: payload.userId, // Assuming the webhook payload contains a userId
    };

    console.log("Received and processed webhook into ChatMessage:", message);
    // In a real app you would now save this to Firestore, e.g.:
    // const newDoc = await admin.firestore().collection('chats').doc(someChatId).collection('messages').add(message);

    res.status(200).json({ status: "received", processedMessage: message });
});


// Expose the Express app as a Cloud Function named "api"
// This groups all the app's routes under a single function.
export const api = functions.https.onRequest(app);
