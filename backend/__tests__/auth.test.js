import request from 'supertest';
import { app } from '../src/app.js';
import User from '../src/models/user.model.js';
import BlacklistToken from '../src/models/blacklistToken.model.js';
import { setupTestDB, teardownTestDB, clearDB } from './setup.js';

describe('User Authentication Endpoints', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  describe('POST /users/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          fullname: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User registered successfully');
      expect(res.body.data.email).toBe('john@example.com');
      expect(res.body.data.fullname.firstName).toBe('John');
      expect(res.body.data.fullname.lastName).toBe('Doe');
    });

    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          fullname: 'John Doe',
          email: 'invalid-email',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid Email',
          }),
        ])
      );
    });

    it('should fail with short password', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          fullname: 'John Doe',
          email: 'john@example.com',
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Password must be at least 6 characters long',
          }),
        ])
      );
    });

    it('should fail with short fullname', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          fullname: 'Jo',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Full name must be at least 3 characters long',
          }),
        ])
      );
    });

    it('should fail with duplicate email', async () => {
      await request(app)
        .post('/users/register')
        .send({
          fullname: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/users/register')
        .send({
          fullname: 'Jane Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          fullname: 'John Doe',
          email: 'john@example.com',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /users/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/users/register')
        .send({
          fullname: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });
    });

    it('should login user successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User logged in successfully');
      expect(res.body.data.user.email).toBe('john@example.com');
      expect(res.body.data.token).toBeDefined();
      expect(typeof res.body.data.token).toBe('string');
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with non-existent user', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'notexist@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with invalid email format', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid Email',
          }),
        ])
      );
    });

    it('should fail with short password', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should set token in cookie', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.headers['set-cookie']).toBeDefined();
    });
  });

  describe('GET /users/profile', () => {
    let loginToken;

    beforeEach(async () => {
      await request(app)
        .post('/users/register')
        .send({
          fullname: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const loginRes = await request(app)
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      loginToken = loginRes.body.data.token;
    });

    it('should fetch user profile with valid token', async () => {
      const res = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${loginToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('john@example.com');
      expect(res.body.data.fullname.firstName).toBe('John');
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get('/users/profile');

      expect(res.status).toBe(401);
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/users/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });

    it('should accept token from cookie', async () => {
      const loginRes = await request(app)
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .get('/users/profile')
        .set('Cookie', loginRes.headers['set-cookie']);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /users/logout', () => {
    let loginToken;

    beforeEach(async () => {
      await request(app)
        .post('/users/register')
        .send({
          fullname: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      const loginRes = await request(app)
        .post('/users/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      loginToken = loginRes.body.data.token;
    });

    it('should logout user successfully', async () => {
      const res = await request(app)
        .get('/users/logout')
        .set('Authorization', `Bearer ${loginToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Logged out successfully');
    });

    it('should clear token cookie on logout', async () => {
      const res = await request(app)
        .get('/users/logout')
        .set('Authorization', `Bearer ${loginToken}`);

      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should blacklist token after logout', async () => {
      await request(app)
        .get('/users/logout')
        .set('Authorization', `Bearer ${loginToken}`);

      const blacklistedToken = await BlacklistToken.findOne({ token: loginToken });
      expect(blacklistedToken).toBeDefined();
    });

    it('should fail to access profile with blacklisted token', async () => {
      await request(app)
        .get('/users/logout')
        .set('Authorization', `Bearer ${loginToken}`);

      const res = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${loginToken}`);

      expect(res.status).toBe(401);
    });

    it('should fail logout without token', async () => {
      const res = await request(app)
        .get('/users/logout');

      expect(res.status).toBe(401);
    });
  });
});
