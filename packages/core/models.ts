import { firestore } from 'firebase-admin';

/**
 * =================================================================
 *  USER PROFILE DATA MODEL
 * =================================================================
 *
 * Firestore Structure:
 *
 * /users/{userId}
 *
 * - A root collection named "users".
 * - Each document's ID is the Firebase Authentication user ID.
 * - This structure allows for easy and secure access to the current
 *   user's profile data using Firestore security rules.
 */
export interface User {
  id: string; // Corresponds to the Firebase Auth user ID
  email: string; // User's email address
  displayName: string; // User's full name or chosen display name
  photoURL?: string; // URL for the user's profile picture
  createdAt: firestore.Timestamp; // Server-side timestamp of account creation
  googleRefreshToken?: string; // OAuth 2.0 refresh token for Google APIs (e.g., Classroom)

  // Add any other user-specific profile fields here
  // e.g., learningGoals: string[];
}


/**
 * =================================================================
 *  CHAT MESSAGE DATA MODEL
 * =================================================================
 *
 * Firestore Structure:
 *
 * /chats/{chatId}/messages/{messageId}
 *
 * - A root collection named "chats".
 * - Each document in "chats" represents a single chat session or thread.
 * - Each "chat" document contains a sub-collection named "messages".
 * - Each document in the "messages" sub-collection is a single chat message.
 * - This allows for scalable chat logs that can be queried efficiently per-session.
 */
export interface ChatMessage {
  id: string; // Unique ID for the message
  text: string; // The content of the message
  sentAt: firestore.Timestamp; // Server-side timestamp of when the message was sent
  sentBy: 'user' | 'phantom'; // Indicates who sent the message
  userId: string; // The ID of the user this chat belongs to
}
