"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const admin = __importStar(require("firebase-admin"));
const googleapis_1 = require("googleapis");
const jwt = __importStar(require("jsonwebtoken"));
const secret_manager_1 = require("@google-cloud/secret-manager");
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
const secretManagerClient = new secret_manager_1.SecretManagerServiceClient();
const projectId = process.env.GCLOUD_PROJECT || 'myphantomdev';
// --- Helper Functions ---
let serviceAccountKey;
async function getServiceAccountKey() {
    var _a, _b;
    if (serviceAccountKey)
        return serviceAccountKey;
    const [version] = await secretManagerClient.accessSecretVersion({
        name: `projects/${projectId}/secrets/gemini-live-service-account-key/versions/latest`,
    });
    const payload = (_b = (_a = version.payload) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.toString();
    if (!payload)
        throw new Error("Could not retrieve service account key.");
    serviceAccountKey = JSON.parse(payload);
    return serviceAccountKey;
}
let oauth2ClientInstance;
async function getOAuth2Client() {
    var _a, _b, _c, _d;
    if (oauth2ClientInstance)
        return oauth2ClientInstance;
    const [clientIdVersion] = await secretManagerClient.accessSecretVersion({
        name: `projects/${projectId}/secrets/GOOGLE_OAUTH_CLIENT_ID/versions/latest`,
    });
    const clientId = (_b = (_a = clientIdVersion.payload) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.toString();
    const [clientSecretVersion] = await secretManagerClient.accessSecretVersion({
        name: `projects/${projectId}/secrets/GOOGLE_OAUTH_CLIENT_SECRET/versions/latest`,
    });
    const clientSecret = (_d = (_c = clientSecretVersion.payload) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.toString();
    if (!clientId || !clientSecret) {
        throw new Error("Could not retrieve OAuth credentials from Secret Manager.");
    }
    oauth2ClientInstance = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, 'http://localhost:3000/oauth-callback');
    return oauth2ClientInstance;
}
// --- API Endpoints ---
app.get("/", (req, res) => res.status(200).json({ message: "Integrations service is up and running." }));
app.post("/generate-gemini-token", async (req, res) => {
    try {
        const { sessionId, userId } = req.body;
        if (!sessionId || !userId) {
            return res.status(400).json({ error: "sessionId and userId are required in the request body." });
        }
        const key = await getServiceAccountKey();
        const now = Math.floor(Date.now() / 1000);
        const expiry = now + 3600;
        const claims = { iss: key.client_email, sub: key.client_email, aud: "https://generativelanguage.googleapis.com/", iat: now, exp: expiry, session_id: sessionId, user_id: userId };
        const token = jwt.sign(claims, key.private_key, { algorithm: 'RS256' });
        return res.status(200).json({ token });
    }
    catch (error) {
        console.error("Error generating Gemini Live token:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Failed to generate token.", details: errorMessage });
    }
});
app.post("/google-oauth-callback", async (req, res) => {
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
    }
    catch (error) {
        console.error("Error in Google OAuth callback:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Failed to process OAuth callback.", details: errorMessage });
    }
});
app.get("/classroom/courses", async (req, res) => {
    var _a, _b;
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId query parameter is required." });
        }
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists || !((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.googleRefreshToken)) {
            return res.status(403).json({ error: "User has not connected their Google account or does not exist." });
        }
        const oauthClient = await getOAuth2Client();
        oauthClient.setCredentials({ refresh_token: (_b = userDoc.data()) === null || _b === void 0 ? void 0 : _b.googleRefreshToken });
        const classroom = googleapis_1.google.classroom({ version: 'v1', auth: oauthClient });
        const courseList = await classroom.courses.list();
        return res.status(200).json(courseList.data.courses || []);
    }
    catch (error) {
        console.error("Error listing Google Classroom courses:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Failed to list courses.", details: errorMessage });
    }
});
//# sourceMappingURL=app.js.map