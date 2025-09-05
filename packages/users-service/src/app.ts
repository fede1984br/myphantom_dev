import express from "express";
import * as admin from "firebase-admin";
import { User } from "@my-phantom/core/models";

// This file is exported for testing and for wrapping in a cloud function
// It does not listen on a port itself.

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Users service is up and running." });
});

app.get("/:id", (req, res) => {
    const userId = req.params.id;
    const mockUser: User = {
        id: userId,
        email: `user.${userId}@example.com`,
        displayName: `User ${userId}`,
        createdAt: admin.firestore.Timestamp.now(),
    };
    res.status(200).json(mockUser);
});

export { app };
