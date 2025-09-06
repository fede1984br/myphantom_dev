"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
// --- Mocks ---
// We need to mock the modules that our app uses for external communication.
const mockGetToken = jest.fn();
const mockSetCredentials = jest.fn();
const mockCoursesList = jest.fn();
const mockUpdate = jest.fn();
const mockGet = jest.fn();
// Mock the entire 'googleapis' module
jest.mock('googleapis', () => ({
    google: {
        auth: {
            OAuth2: jest.fn().mockImplementation(() => ({
                getToken: mockGetToken,
                setCredentials: mockSetCredentials,
            })),
        },
        classroom: jest.fn().mockImplementation(() => ({
            courses: {
                list: mockCoursesList,
            },
        })),
    },
}));
// Mock the 'firebase-admin' module
jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn(),
    firestore: jest.fn(() => ({
        collection: jest.fn((collectionName) => {
            if (collectionName === 'users') {
                return {
                    doc: jest.fn((docId) => ({
                        update: mockUpdate,
                        get: mockGet,
                    })),
                };
            }
            return {}; // Default mock for other collections
        }),
    })),
}));
// Mock the Secret Manager Client
jest.mock('@google-cloud/secret-manager', () => ({
    SecretManagerServiceClient: jest.fn().mockImplementation(() => ({
        accessSecretVersion: jest.fn().mockResolvedValue([
            {
                payload: { data: 'fake-secret-value' },
            },
        ]),
    })),
}));
describe('Google Classroom Integration Endpoints', () => {
    // Clear all mocks before each test to ensure test isolation
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('POST /google-oauth-callback', () => {
        it('should exchange an auth code for tokens and store the refresh token in Firestore', async () => {
            // Arrange: mock the getToken call to return a refresh token
            mockGetToken.mockResolvedValue({ tokens: { refresh_token: 'mock-refresh-token' } });
            // Act: send a request to the endpoint
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/google-oauth-callback')
                .send({ code: 'valid-auth-code', userId: 'user-with-new-token' });
            // Assert: check the response and that our mocks were called correctly
            expect(response.status).toBe(200);
            expect(response.body.message).toContain('Successfully connected');
            expect(mockGetToken).toHaveBeenCalledWith('valid-auth-code');
            expect(mockUpdate).toHaveBeenCalledWith({ googleRefreshToken: 'mock-refresh-token' });
        });
    });
    describe('GET /classroom/courses', () => {
        it('should return courses for a user with a valid refresh token', async () => {
            // Arrange: mock Firestore to return a user with a token
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({ googleRefreshToken: 'valid-refresh-token' }),
            });
            // Arrange: mock the Classroom API to return a list of courses
            mockCoursesList.mockResolvedValue({
                data: { courses: [{ id: '123', name: 'Physics 101' }] },
            });
            // Act
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/classroom/courses?userId=authorized-user');
            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: '123', name: 'Physics 101' }]);
            expect(mockSetCredentials).toHaveBeenCalledWith({ refresh_token: 'valid-refresh-token' });
            expect(mockCoursesList).toHaveBeenCalled();
        });
        it('should return a 403 error if the user has no refresh token', async () => {
            // Arrange: mock Firestore to return a user without a token
            mockGet.mockResolvedValue({
                exists: true,
                data: () => ({ googleRefreshToken: null }),
            });
            // Act
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/classroom/courses?userId=unauthorized-user');
            // Assert
            expect(response.status).toBe(403);
            expect(response.body.error).toContain('User has not connected their Google account');
        });
        it('should return a 404 error if the user does not exist', async () => {
            // Arrange: mock Firestore to return a non-existent user
            mockGet.mockResolvedValue({ exists: false });
            // Act
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/classroom/courses?userId=non-existent-user');
            // Assert
            expect(response.status).toBe(404);
            expect(response.body.error).toContain('User not found');
        });
    });
});
//# sourceMappingURL=classroom.test.js.map