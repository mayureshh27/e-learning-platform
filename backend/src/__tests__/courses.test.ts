import request from 'supertest';
import app from '../app';
import User from '../models/user.model';
import Course from '../models/course.model';
import { Types } from 'mongoose';

describe('Courses API', () => {
    let adminToken: string;
    let userToken: string;
    let adminId: Types.ObjectId;

    beforeEach(async () => {
        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
        });
        adminId = admin._id as Types.ObjectId;

        const adminLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'admin@example.com', password: 'password123' });
        adminToken = adminLogin.body.accessToken;

        // Create regular user
        await User.create({
            name: 'Regular User',
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
        });

        const userLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user@example.com', password: 'password123' });
        userToken = userLogin.body.accessToken;
    });

    describe('GET /api/courses', () => {
        beforeEach(async () => {
            // Seed some courses
            await Course.create([
                {
                    title: 'React Fundamentals',
                    slug: 'react-fundamentals',
                    description: 'Learn React from scratch with hands-on examples',
                    price: 49.99,
                    category: 'frontend',
                    level: 'beginner',
                    instructor: adminId,
                    isPublished: true,
                },
                {
                    title: 'Node.js Advanced',
                    slug: 'nodejs-advanced',
                    description: 'Advanced Node.js patterns for production applications',
                    price: 79.99,
                    category: 'backend',
                    level: 'advanced',
                    instructor: adminId,
                    isPublished: true,
                },
            ]);
        });

        it('should return all courses', async () => {
            const res = await request(app).get('/api/courses');

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.results).toBe(2);
            expect(res.body.data).toHaveLength(2);
        });

        it('should filter by category', async () => {
            const res = await request(app).get('/api/courses?category=frontend');

            expect(res.status).toBe(200);
            expect(res.body.results).toBe(1);
            expect(res.body.data[0].category).toBe('frontend');
        });

        it('should filter by level', async () => {
            const res = await request(app).get('/api/courses?level=advanced');

            expect(res.status).toBe(200);
            expect(res.body.results).toBe(1);
            expect(res.body.data[0].level).toBe('advanced');
        });
    });

    describe('GET /api/courses/:id', () => {
        let courseId: string;

        beforeEach(async () => {
            const course = await Course.create({
                title: 'Test Course',
                slug: 'test-course',
                description: 'A comprehensive test course for learning',
                price: 29.99,
                category: 'testing',
                level: 'beginner',
                instructor: adminId,
            });
            courseId = course._id.toString();
        });

        it('should return a single course', async () => {
            const res = await request(app).get(`/api/courses/${courseId}`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data.title).toBe('Test Course');
        });

        it('should return 404 for non-existent course', async () => {
            const fakeId = new Types.ObjectId().toString();
            const res = await request(app).get(`/api/courses/${fakeId}`);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /api/courses (Admin only)', () => {
        // Valid course with description >= 20 chars
        const newCourse = {
            title: 'New Course Title',
            description: 'A brand new comprehensive course covering all topics in depth',
            price: 59.99,
            category: 'devops',
            level: 'intermediate',
        };

        it('should create a course when admin', async () => {
            const res = await request(app)
                .post('/api/courses')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newCourse);

            expect(res.status).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.data.title).toBe('New Course Title');
            expect(res.body.data.slug).toContain('new-course-title');
        });

        it('should reject when not admin', async () => {
            const res = await request(app)
                .post('/api/courses')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newCourse);

            expect(res.status).toBe(403);
        });

        it('should reject without authentication', async () => {
            const res = await request(app)
                .post('/api/courses')
                .send(newCourse);

            expect(res.status).toBe(401);
        });
    });

    describe('PUT /api/courses/:id (Admin only)', () => {
        let courseId: string;

        beforeEach(async () => {
            const course = await Course.create({
                title: 'Update Me',
                slug: 'update-me',
                description: 'This course is to be updated soon',
                price: 10,
                category: 'test',
                level: 'beginner',
                instructor: adminId,
            });
            courseId = course._id.toString();
        });

        it('should update a course when admin', async () => {
            const res = await request(app)
                .put(`/api/courses/${courseId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ title: 'Updated Title', price: 99.99 });

            expect(res.status).toBe(200);
            expect(res.body.data.title).toBe('Updated Title');
            expect(res.body.data.price).toBe(99.99);
        });
    });

    describe('DELETE /api/courses/:id (Admin only)', () => {
        let courseId: string;

        beforeEach(async () => {
            const course = await Course.create({
                title: 'Delete Me',
                slug: 'delete-me',
                description: 'This course will be deleted soon',
                price: 10,
                category: 'test',
                level: 'beginner',
                instructor: adminId,
            });
            courseId = course._id.toString();
        });

        it('should delete a course when admin', async () => {
            const res = await request(app)
                .delete(`/api/courses/${courseId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(204);

            // Verify deletion
            const course = await Course.findById(courseId);
            expect(course).toBeNull();
        });
    });
});
