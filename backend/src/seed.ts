import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model';
import Course, { ICourse } from './models/course.model';
import Enrollment from './models/enrollment.model';

dotenv.config();

const SAMPLE_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const seedData = async () => {
    try {
        console.log('🌱 Starting seed...');
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

        // Courses Data
        const coursesData = [
            {
                title: 'The Complete React 18 Developer Course',
                slug: 'complete-react-developer',
                description: 'Master React 18 from basics to advanced concepts including Hooks, Context API, Redux Toolkit, and performance optimization. Build real-world projects.',
                price: 89.99,
                category: 'web-development',
                level: 'intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop',
                instructor: adminUser._id,
                isPublished: true,
                modules: [
                    {
                        title: 'Getting Started',
                        lessons: [
                            { title: 'Welcome to the Course', type: 'video', content: 'Course Overview', duration: 120, isFree: true, videoUrl: SAMPLE_VIDEO_URL },
                            { title: 'Setting Up Environment', type: 'video', content: 'VS Code & Node.js', duration: 400, videoUrl: SAMPLE_VIDEO_URL },
                        ],
                    },
                    {
                        title: 'React Core Concepts',
                        lessons: [
                            { title: 'JSX & Components', type: 'video', content: 'Understanding the view layer', duration: 600, videoUrl: SAMPLE_VIDEO_URL },
                            { title: 'State & Props', type: 'video', content: 'Managing data flow', duration: 850, videoUrl: SAMPLE_VIDEO_URL },
                            { title: 'Handling Events', type: 'video', content: 'Interactivity', duration: 500, videoUrl: SAMPLE_VIDEO_URL },
                        ],
                    },
                ],
            },
            {
                title: 'Enterprise Node.js & Microservices',
                slug: 'enterprise-nodejs',
                description: 'Build scalable, production-ready backend systems using Node.js, Express, Microservices architecture, Docker, and Kubernetes.',
                price: 129.99,
                category: 'backend',
                level: 'advanced',
                thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2574&auto=format&fit=crop',
                instructor: adminUser._id,
                isPublished: true,
                modules: [
                    {
                        title: 'Microservices Fundamentals',
                        lessons: [
                            { title: 'Monolithic vs Microservices', type: 'video', content: 'Architecture comparison', duration: 300, isFree: true, videoUrl: SAMPLE_VIDEO_URL },
                            { title: 'Dockerizing Node Apps', type: 'video', content: 'Containers 101', duration: 900, videoUrl: SAMPLE_VIDEO_URL },
                        ],
                    },
                    {
                        title: 'Kubernetes Orchestration',
                        lessons: [
                            { title: 'K8s Basics', type: 'video', content: 'Pods and Services', duration: 1200, videoUrl: SAMPLE_VIDEO_URL },
                        ],
                    },
                ],
            },
            {
                title: 'Python for Data Science Bootcamp',
                slug: 'python-data-science',
                description: 'Learn Python, NumPy, Pandas, Matplotlib, and Scikit-learn. Analyze data distributions and visualize results.',
                price: 94.99,
                category: 'data-science',
                level: 'beginner',
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
                instructor: adminUser._id,
                isPublished: true,
                modules: [
                    {
                        title: 'Python Basics',
                        lessons: [
                            { title: 'Variables & Data Types', type: 'video', duration: 400, isFree: true, videoUrl: SAMPLE_VIDEO_URL },
                            { title: 'Lists & Dictionaries', type: 'video', duration: 600, videoUrl: SAMPLE_VIDEO_URL },
                        ],
                    },
                    {
                        title: 'Pandas for Analysis',
                        lessons: [
                            { title: 'DataFrames', type: 'video', duration: 1000, videoUrl: SAMPLE_VIDEO_URL },
                            { title: 'Data Cleaning', type: 'video', duration: 1200, videoUrl: SAMPLE_VIDEO_URL },
                        ],
                    },
                ],
            },
            {
                title: 'UI/UX Design Masterclass',
                slug: 'ui-ux-design',
                description: 'From wireframes to high-fidelity prototypes. Learn Figma, color theory, typography, and design systems.',
                price: 59.99,
                category: 'design',
                level: 'intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=2670&auto=format&fit=crop',
                instructor: adminUser._id,
                isPublished: true,
                modules: [
                    {
                        title: 'Design Principles',
                        lessons: [
                            { title: 'Color Theory', type: 'video', duration: 400, isFree: true, videoUrl: SAMPLE_VIDEO_URL },
                            { title: 'Typography', type: 'video', duration: 500, videoUrl: SAMPLE_VIDEO_URL },
                        ],
                    },
                    {
                        title: 'Figma Mastery',
                        lessons: [
                            { title: 'Auto Layout', type: 'video', duration: 800, videoUrl: SAMPLE_VIDEO_URL },
                            { title: 'Prototyping', type: 'video', duration: 700, videoUrl: SAMPLE_VIDEO_URL },
                        ],
                    },
                ],
            },
            {
                title: 'DevOps: CI/CD with GitHub Actions',
                slug: 'devops-cicd',
                description: 'Automate your testing and deployment workflows using GitHub Actions. Deploy to AWS, Vercel, and Docker Hub.',
                price: 69.99,
                category: 'devops',
                level: 'advanced',
                thumbnail: 'https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?q=80&w=2643&auto=format&fit=crop',
                instructor: adminUser._id,
                isPublished: true,
                modules: [
                    {
                        title: 'CI/CD Concepts',
                        lessons: [
                            { title: 'What is CI/CD?', type: 'video', duration: 300, isFree: true, videoUrl: SAMPLE_VIDEO_URL },
                        ],
                    },
                    {
                        title: 'Building Pipelines',
                        lessons: [
                            { title: 'First Action Workflow', type: 'video', duration: 600, videoUrl: SAMPLE_VIDEO_URL },
                            { title: 'Deployment Strategies', type: 'video', duration: 900, videoUrl: SAMPLE_VIDEO_URL },
                        ],
                    },
                ],
            },
        ];

        // Type assertion to bypass strict _id missing on subdocs during creation
        const createdCourses = await Course.create(coursesData as unknown as Partial<ICourse>[]);
        console.log(`📚 Created ${createdCourses.length} courses`);

        // Enroll user in the first course (React)
        if (createdCourses.length > 0) {
            const firstCourse = createdCourses[0];
            const firstLesson = firstCourse.modules[0]?.lessons[0];
            await Enrollment.create({
                user: regularUser._id,
                course: firstCourse._id,
                progress: 5,
                completedLessons: firstLesson?._id ? [firstLesson._id] : [],
            });
            console.log(`📝 Enrolled user in: ${firstCourse.title}`);
        }

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
