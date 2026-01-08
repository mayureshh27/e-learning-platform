import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model';
import Course from './models/course.model';
import Enrollment from './models/enrollment.model';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Course.deleteMany({});
        await Enrollment.deleteMany({});
        console.log('🗑️ Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
        });
        console.log('👤 Created admin user: admin@example.com / password123');

        // Create regular user
        const regularUser = await User.create({
            name: 'John Doe',
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
        });
        console.log('👤 Created user: user@example.com / password123');

        // Create sample courses
        const courses = await Course.create([
            {
                title: 'Complete React Developer Course',
                slug: 'complete-react-developer',
                description: 'Master React from basics to advanced concepts including hooks, context, and Redux.',
                price: 49.99,
                category: 'web-development',
                level: 'intermediate',
                thumbnail: 'https://placehold.co/600x400?text=React+Course',
                instructor: adminUser._id,
                isPublished: true,
                modules: [
                    {
                        title: 'Getting Started',
                        lessons: [
                            { title: 'Introduction to React', type: 'video', content: 'Welcome to the course!', duration: 300, isFree: true },
                            { title: 'Setting Up Your Environment', type: 'video', content: 'Install Node.js and create-react-app', duration: 600 },
                        ],
                    },
                    {
                        title: 'React Fundamentals',
                        lessons: [
                            { title: 'Components and JSX', type: 'video', content: 'Learn about components', duration: 900 },
                            { title: 'State and Props', type: 'video', content: 'Managing data in React', duration: 1200 },
                        ],
                    },
                ],
            },
            {
                title: 'Node.js Backend Masterclass',
                slug: 'nodejs-backend-masterclass',
                description: 'Build production-ready REST APIs with Node.js, Express, and MongoDB.',
                price: 59.99,
                category: 'backend',
                level: 'advanced',
                thumbnail: 'https://placehold.co/600x400?text=Node.js+Course',
                instructor: adminUser._id,
                isPublished: true,
                modules: [
                    {
                        title: 'Introduction',
                        lessons: [
                            { title: 'What is Node.js?', type: 'video', content: 'Understanding Node.js', duration: 450, isFree: true },
                            { title: 'Setting Up Express', type: 'video', content: 'Create your first Express app', duration: 600 },
                        ],
                    },
                ],
            },
            {
                title: 'Python for Beginners',
                slug: 'python-beginners',
                description: 'Start your programming journey with Python - the most beginner-friendly language.',
                price: 0,
                category: 'programming',
                level: 'beginner',
                thumbnail: 'https://placehold.co/600x400?text=Python+Course',
                instructor: adminUser._id,
                isPublished: true,
                modules: [
                    {
                        title: 'Python Basics',
                        lessons: [
                            { title: 'Variables and Data Types', type: 'text', content: 'Learn about Python variables', isFree: true },
                            { title: 'Control Flow', type: 'text', content: 'If statements and loops' },
                        ],
                    },
                ],
            },
        ]);
        console.log(`📚 Created ${courses.length} courses`);

        // Enroll user in first course
        const firstLesson = courses[0].modules[0].lessons[0];
        await Enrollment.create({
            user: regularUser._id,
            course: courses[0]._id,
            progress: 25,
            completedLessons: firstLesson._id ? [firstLesson._id] : [],
        });
        console.log('📝 Enrolled user in React course');

        console.log('\n✅ Seed complete!');
        console.log('\n--- Login Credentials ---');
        console.log('Admin: admin@example.com / password123');
        console.log('User:  user@example.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
};

seedData();
