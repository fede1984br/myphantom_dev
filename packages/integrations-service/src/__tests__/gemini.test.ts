import request from 'supertest';
import { app } from '../app'; // Import the decoupled express app
import * as jwt from 'jsonwebtoken';

// Mock the SecretManagerServiceClient at the module level
jest.mock('@google-cloud/secret-manager', () => {
  return {
    SecretManagerServiceClient: jest.fn().mockImplementation(() => {
      return {
        accessSecretVersion: jest.fn().mockImplementation((request: any) => {
          if (request.name.includes('gemini-live-service-account-key')) {
            return Promise.resolve([
              {
                payload: {
                  data: JSON.stringify({
                    client_email: 'fake-gemini-minter@gserviceaccount.com',
                    jwt_secret: 'a-super-secret-key-for-hs256',
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
    const res = await request(app)
      .post('/generate-gemini-token')
      .send({ userId: 'test-user' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('sessionId and userId are required');
  });

  it('should return 400 if userId is missing', async () => {
    const res = await request(app)
      .post('/generate-gemini-token')
      .send({ sessionId: 'test-session' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('sessionId and userId are required');
  });

  it('should return a valid JWT with correct claims on success', async () => {
    const res = await request(app)
      .post('/generate-gemini-token')
      .send({ sessionId: 'test-session-123', userId: 'test-user-456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');

    // We can now verify the signature since we are using HS256 with a known secret.
    const payload = jwt.verify(res.body.token, 'a-super-secret-key-for-hs256') as jwt.JwtPayload;

    expect(payload).toBeDefined();
    if (!payload) return; // Type guard for TypeScript

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
