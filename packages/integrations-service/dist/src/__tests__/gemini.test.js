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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app"); // Import the decoupled express app
const jwt = __importStar(require("jsonwebtoken"));
// Mock the SecretManagerServiceClient at the module level
jest.mock('@google-cloud/secret-manager', () => {
    return {
        SecretManagerServiceClient: jest.fn().mockImplementation(() => {
            return {
                accessSecretVersion: jest.fn().mockImplementation((request) => {
                    if (request.name.includes('gemini-live-service-account-key')) {
                        return Promise.resolve([
                            {
                                payload: {
                                    data: JSON.stringify({
                                        client_email: 'fake-gemini-minter@gserviceaccount.com',
                                        private_key: '-----BEGIN PRIVATE KEY-----\nFAKE_GEMINI_PRIVATE_KEY\n-----END PRIVATE KEY-----\n',
                                    }),
                                },
                            },
                        ]);
                    }
                    // Add mocks for other secrets if needed by other tests
                    return Promise.resolve([{}]);
                }),
            };
        }),
    };
});
describe('POST /generate-gemini-token', () => {
    it('should return 400 if sessionId is missing', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/generate-gemini-token')
            .send({ userId: 'test-user' });
        expect(res.status).toBe(400);
        expect(res.body.error).toContain('sessionId and userId are required');
    });
    it('should return 400 if userId is missing', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/generate-gemini-token')
            .send({ sessionId: 'test-session' });
        expect(res.status).toBe(400);
        expect(res.body.error).toContain('sessionId and userId are required');
    });
    it('should return a valid JWT with correct claims on success', async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post('/generate-gemini-token')
            .send({ sessionId: 'test-session-123', userId: 'test-user-456' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        // We can't verify the signature since we used a fake private key,
        // but we can decode the payload and check its contents.
        const payload = jwt.decode(res.body.token);
        expect(payload).toBeDefined();
        if (!payload)
            return; // Type guard for TypeScript
        expect(payload.iss).toBe('fake-gemini-minter@gserviceaccount.com');
        expect(payload.aud).toBe('https://generativelanguage.googleapis.com/');
        expect(payload.session_id).toBe('test-session-123');
        expect(payload.user_id).toBe('test-user-456');
        expect(payload.exp).toBeDefined();
        expect(payload.iat).toBeDefined();
        if (payload.exp && payload.iat) {
            expect(payload.exp).toBeGreaterThan(payload.iat);
        }
    });
});
//# sourceMappingURL=gemini.test.js.map