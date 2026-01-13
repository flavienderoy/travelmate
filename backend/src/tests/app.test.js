const request = require('supertest');
const app = require('../server');

describe('TravelMate API', () => {
  describe('GET /health', () => {
    it('devrait retourner le statut de santé', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body).toHaveProperty('status', 'OK');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    it('devrait retourner les informations de l\'API', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);

      expect(res.body).toHaveProperty('message', 'TravelMate API');
      expect(res.body).toHaveProperty('version', '1.0.0');
      expect(res.body).toHaveProperty('documentation', '/api-docs');
    });
  });

  describe('GET /api-docs', () => {
    it('devrait servir la documentation Swagger', async () => {
      await request(app)
        .get('/api-docs')
        .expect(200);
    });
  });
});
