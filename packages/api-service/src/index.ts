import * as functions from "firebase-functions";
import { usersApp, integrationsApp } from "./app";

// Expose the Express apps as a Cloud Functions

export const users = functions.https.onRequest(usersApp);
export const integrations = functions.https.onRequest(integrationsApp);
