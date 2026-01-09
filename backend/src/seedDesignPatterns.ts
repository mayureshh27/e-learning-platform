// IMPORTANT: Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

// Now import modules that depend on env vars
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import cloudinary from './config/cloudinary';
import User from './models/user.model';
import Course from './models/course.model';

const DESIGN_PATTERNS_DIR = path.join(__dirname, '../../Desgin-patterns');

/**
 * Get video duration in minutes from file metadata
 */
function getVideoDurationInMinutes(filePath: string): number {
    // For now, we'll use file size as a rough estimate
    // Actual duration would require ffprobe or similar
    const stats = fs.statSync(filePath);
    const sizeInMB = stats.size / (1024 * 1024);
    // Rough estimate: ~2MB per minute for compressed video
    return Math.round(sizeInMB / 2);
}

/**
 * Upload a file to Cloudinary
 */
async function uploadToCloudinary(filePath: string, folder: string, resourceType: 'image' | 'video') {
    try {
        console.log(`📤 Uploading ${path.basename(filePath)}...`);
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: resourceType,
            ...(resourceType === 'video' && {
                eager: [{ streaming_profile: 'auto', format: 'm3u8' }],
                eager_async: true,
            }),
        });
        console.log(`✅ ${result.public_id}`);
        return result.public_id;
    } catch (error) {
        console.error(`❌ Failed to upload ${path.basename(filePath)}:`, error);
        throw error;
    }
}

/**
 * Seed Design Patterns Course
 */
async function seedDesignPatternsCourse() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('✅ Connected to MongoDB\n');

        // Find or create admin user
        let admin = await User.findOne({ email: 'admin@example.com' });
        if (!admin) {
            admin = await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin',
            });
            console.log('✅ Created admin user\n');
        }

        // Check if directory exists
        if (!fs.existsSync(DESIGN_PATTERNS_DIR)) {
            console.error(`❌ Directory not found: ${DESIGN_PATTERNS_DIR}`);
            process.exit(1);
        }

        console.log('📁 Found design patterns directory\n');

        // Upload course thumbnail
        console.log('🖼️  Uploading course thumbnail...');
        const thumbnailPath = path.join(DESIGN_PATTERNS_DIR, 'thumbnail.png');
        let thumbnailPublicId: string | undefined;

        if (fs.existsSync(thumbnailPath)) {
            thumbnailPublicId = await uploadToCloudinary(
                thumbnailPath,
                'e-learning/courses',
                'image'
            );
        }
        console.log('');

        // Define course structure matching actual video files
        // FREE: Welcome, Introduction, and Singleton (first design pattern)
        const modules = [
            {
                title: 'Introduction to Design Patterns',
                lessons: [
                    {
                        title: 'Welcome to Design Patterns',
                        videoFile: 'Welcome_to_Design_Patterns.mp4',
                        isFree: true,
                    },
                    {
                        title: 'An Introduction to Design Patterns',
                        videoFile: 'An_Introduction_to_Design_Patterns.mp4',
                        isFree: true,
                    },
                    {
                        title: 'Head First Design Patterns',
                        videoFile: 'Head_First_Design_Patterns.mp4',
                        isFree: false,
                    },
                    {
                        title: 'Better Living with Patterns',
                        videoFile: 'Better_Living_with_Patterns.mp4',
                        isFree: false,
                    },
                ],
            },
            {
                title: 'Creational Patterns',
                lessons: [
                    {
                        title: 'Singleton: One of a Kind',
                        videoFile: 'Singleton__One_of_a_Kind.mp4',
                        isFree: true, // First design pattern is free
                    },
                    {
                        title: 'The Factory Pattern',
                        videoFile: 'The_Factory_Pattern.mp4',
                        isFree: false,
                    },
                ],
            },
            {
                title: 'Structural Patterns',
                lessons: [
                    {
                        title: 'The Decorator Pattern',
                        videoFile: 'The_Decorator_Pattern.mp4',
                        isFree: false,
                    },
                    {
                        title: 'Adapter & Facade Patterns',
                        videoFile: 'Adapter_&_Facade_Patterns.mp4',
                        isFree: false,
                    },
                    {
                        title: 'The Proxy Pattern',
                        videoFile: 'The_Proxy_Pattern.mp4',
                        isFree: false,
                    },
                    {
                        title: 'Iterator & Composite Patterns',
                        videoFile: 'Iterator_&_Composite_Patterns.mp4',
                        isFree: false,
                    },
                ],
            },
            {
                title: 'Behavioral Patterns',
                lessons: [
                    {
                        title: 'Keeping Objects in the Know (Observer)',
                        videoFile: 'Keeping_Objects_in_the_Know.mp4',
                        isFree: false,
                    },
                    {
                        title: 'State: From Chaos to Clarity',
                        videoFile: 'State__Chaos_to_Clarity.mp4',
                        isFree: false,
                    },
                    {
                        title: 'The Template Method Pattern',
                        videoFile: 'The_Template_Method_Pattern.mp4',
                        isFree: false,
                    },
                    {
                        title: 'Compound Patterns',
                        videoFile: 'Compound_Patterns.mp4',
                        isFree: false,
                    },
                ],
            },
        ];

        // Upload videos and build course modules
        console.log('📹 Uploading lesson videos...\n');
        const processedModules = [];

        for (const module of modules) {
            console.log(`📚 Module: ${module.title}`);
            const processedLessons = [];

            for (const lesson of module.lessons) {
                const videoPath = path.join(DESIGN_PATTERNS_DIR, lesson.videoFile);
                let videoPublicId: string | undefined;
                let duration = 0;

                if (fs.existsSync(videoPath)) {
                    // Get actual duration from file
                    duration = getVideoDurationInMinutes(videoPath);

                    videoPublicId = await uploadToCloudinary(
                        videoPath,
                        'e-learning/videos/design-patterns',
                        'video'
                    );
                } else {
                    console.warn(`   ⚠️  Not found: ${lesson.videoFile}`);
                }

                processedLessons.push({
                    title: lesson.title,
                    type: 'video' as const,
                    videoPublicId,
                    duration,
                    isFree: lesson.isFree,
                    content: `Master ${lesson.title} with practical examples and real-world applications.`,
                });
            }

            processedModules.push({
                title: module.title,
                lessons: processedLessons,
            });
            console.log('');
        }

        // Create or update the course
        console.log('💾 Creating course in database...');
        const courseData = {
            title: 'Head First Design Patterns Masterclass',
            slug: 'head-first-design-patterns',
            description: 'Master software design patterns with this comprehensive video course. Learn creational, structural, and behavioral patterns through practical examples. Based on the bestselling "Head First Design Patterns" book, this course covers the Gang of Four patterns with modern JavaScript and TypeScript implementations.',
            price: 59.99,
            thumbnailPublicId,
            thumbnail: thumbnailPublicId
                ? `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${thumbnailPublicId}`
                : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
            category: 'Software Engineering',
            level: 'intermediate' as const,
            instructor: admin._id,
            modules: processedModules,
            isPublished: true,
        };

        const existingCourse = await Course.findOne({ slug: courseData.slug });
        if (existingCourse) {
            await Course.findByIdAndUpdate(existingCourse._id, courseData);
            console.log('✅ Updated existing course\n');
        } else {
            await Course.create(courseData);
            console.log('✅ Created new course\n');
        }

        // Summary
        const totalLessons = processedModules.reduce((sum, m) => sum + m.lessons.length, 0);
        const freeLessons = processedModules.reduce(
            (sum, m) => sum + m.lessons.filter((l) => l.isFree).length,
            0
        );
        const totalDuration = processedModules.reduce(
            (sum, m) => sum + m.lessons.reduce((s, l) => s + (l.duration || 0), 0),
            0
        );

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎉 SEEDING COMPLETE!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📚 Course: Head First Design Patterns Masterclass`);
        console.log(`📊 Modules: ${processedModules.length}`);
        console.log(`📹 Total Lessons: ${totalLessons}`);
        console.log(`🆓 Free Preview Lessons: ${freeLessons}`);
        console.log(`⏱️  Total Duration: ~${totalDuration} minutes`);
        console.log(`💰 Price: $${courseData.price}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (error) {
        console.error('\n❌ SEEDING FAILED:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    }
}

// Run the seed
seedDesignPatternsCourse()
    .then(() => {
        console.log('✨ All done!\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
