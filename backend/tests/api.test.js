jest.mock('mongoose', () => {
  const Schema = jest.fn().mockImplementation(() => ({
    pre: jest.fn(),
    methods: {},
    index: jest.fn(),
  }));
  Schema.Types = { ObjectId: String };
  return {
    connection: { readyState: 1 },
    connect: jest.fn(),
    Schema,
    model: jest.fn()
  };
});
jest.mock('../config/db', () => jest.fn());

const request = require('supertest');
const app = require('../server');

describe('API Health Check', () => {
  it('should return 200 on GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });
});

describe('API Auth Endpoints', () => {
  it('should return 400 for login with no credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('success', false);
  });
});
