import request from 'supertest';
import app from '../app';
import User from '../models/user.model';

describe('Auth API', () => {
    describe('POST /api/auth/signup', () => {
        it('should create a new user and return user data', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                    passwordConfirmation: 'password123',
                });

            expect(res.status).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.data.user).toHaveProperty('_id');
            expect(res.body.data.user.name).toBe('Test User');
            expect(res.body.data.user.email).toBe('test@example.com');
            expect(res.body.data.user).not.toHaveProperty('password');
        });

        it('should return 409 if email already exists', async () => {
            // First signup
            await request(app)
                .post('/api/auth/signup')
                .send({
                    name: 'Test User',
                    email: 'duplicate@example.com',
                    password: 'password123',
                    passwordConfirmation: 'password123',
                });

            // Second signup with same email
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    name: 'Another User',
                    email: 'duplicate@example.com',
                    password: 'password456',
                    passwordConfirmation: 'password456',
                });

            expect(res.status).toBe(409);
            expect(res.body.status).toBe('fail');
        });

        it('should return 400 for invalid input', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    name: 'Test',
                    email: 'invalid-email',
                    password: '123', // too short
                    passwordConfirmation: '123',
                });

            expect(res.status).toBe(400);
        });

        it('should return 400 for mismatched passwords', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    name: 'Test User',
                    email: 'test2@example.com',
                    password: 'password123',
                    passwordConfirmation: 'differentpassword',
                });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user directly (bypassing signup validation)
            await User.create({
                name: 'Login Test User',
                email: 'login@example.com',
                password: 'password123',
            });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body).toHaveProperty('accessToken');
        });

        it('should return 401 for invalid password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'wrongpassword',
                });

            expect(res.status).toBe(401);
            // API returns 'fail' for client errors
            expect(res.body.status).toBe('fail');
        });

        it('should return 401 for non-existent user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/auth/me', () => {
        let accessToken: string;

        beforeEach(async () => {
            // Create and login user using signup with passwordConfirmation
            await request(app)
                .post('/api/auth/signup')
                .send({
                    name: 'Me Test User',
                    email: 'me@example.com',
                    password: 'password123',
                    passwordConfirmation: 'password123',
                });

            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'me@example.com',
                    password: 'password123',
                });

            accessToken = loginRes.body.accessToken;
        });

        it('should return current user with valid token', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data.user.email).toBe('me@example.com');
        });

        it('should return 401 without token', async () => {
            const res = await request(app).get('/api/auth/me');

            expect(res.status).toBe(401);
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should return success on logout', async () => {
            const res = await request(app).post('/api/auth/logout');

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
        });
    });
});
