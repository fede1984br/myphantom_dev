import { onRequest } from "firebase-functions/v2/https";
import { usersApp, integrationsApp } from "./app";

// Expose the Express apps as a Cloud Functions

export const users = onRequest(usersApp);
export const integrations = onRequest(integrationsApp);
