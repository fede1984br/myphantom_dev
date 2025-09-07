import request from 'supertest';
import { usersApp, integrationsApp } from '../app';

describe('API Endpoints', () => {
  it('should return 200 for the users endpoint', async () => {
    const response = await request(usersApp).get('/');
    expect(response.status).toBe(200);
  });

  it('should return 200 for the integrations endpoint', async () => {
    const response = await request(integrationsApp).get('/');
    expect(response.status).toBe(200);
  });
});
