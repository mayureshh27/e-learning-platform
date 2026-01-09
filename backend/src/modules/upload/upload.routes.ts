import { Router } from 'express';
import { requireUser } from '../../middleware/requireUser';
import { requireAdmin } from '../../middleware/requireAdmin';
import { generateUploadSignature, getSignedVideoUrl, getImageUrl } from '../../config/cloudinary';
import Enrollment from '../../models/enrollment.model';
import Course from '../../models/course.model';
import AppError from '../../utils/AppError';

const router = Router();

/**
 * POST /api/upload/signature/image
 * Get signature for image upload (thumbnails, avatars)
 * Requires: Authenticated user
 */
router.post('/signature/image', requireUser, (req, res) => {
    const folder = req.body.folder || 'e-learning/images';
    const data = generateUploadSignature(folder, 'image');
    res.json({ status: 'success', data });
});

/**
 * POST /api/upload/signature/video
 * Get signature for video upload (lesson videos)
 * Requires: Admin role
 */
router.post('/signature/video', requireAdmin, (req, res) => {
    const folder = 'e-learning/videos';
    const data = generateUploadSignature(folder, 'video');
    res.json({ status: 'success', data });
});

/**
 * GET /api/upload/video/:courseId/:lessonId
 * Get signed video playback URL
 * Requires: User must be enrolled in the course (or admin)
 */
router.get('/video/:courseId/:lessonId', requireUser, async (req, res, next) => {
    try {
        const { courseId, lessonId } = req.params;
        const user = res.locals.user;

        console.log('📹 Video URL Request:', { courseId, lessonId, userId: user.sub });

        // Find the course and lesson
        const course = await Course.findById(courseId);
        if (!course) {
            console.log('❌ Course not found:', courseId);
            return next(new AppError('Course not found', 404));
        }

        console.log('✅ Course found:', course.title);

        // Find the lesson
        let videoPublicId: string | undefined;
        let lessonIsFree = false;
        let lessonTitle = '';

        for (const module of course.modules) {
            const lesson = module.lessons.find(l => l._id?.toString() === lessonId);
            if (lesson) {
                videoPublicId = lesson.videoPublicId;
                lessonIsFree = lesson.isFree || false;
                lessonTitle = lesson.title;
                break;
            }
        }

        console.log('📝 Lesson details:', { lessonTitle, videoPublicId, lessonIsFree });

        if (!videoPublicId) {
            console.log('❌ No videoPublicId found for lesson:', lessonId);
            return next(new AppError('Video not found for this lesson', 404));
        }

        // Check access: Admin, free lesson, or enrolled user
        const isAdmin = user.role === 'admin';
        if (!isAdmin && !lessonIsFree) {
            const enrollment = await Enrollment.findOne({
                user: user.sub,
                course: courseId,
            });

            if (!enrollment) {
                console.log('❌ User not enrolled:', { userId: user.sub, courseId });
                return next(new AppError('You must be enrolled to access this video', 403));
            }
            console.log('✅ User is enrolled');
        } else {
            console.log('✅ Access granted:', isAdmin ? 'Admin' : 'Free lesson');
        }

        // Generate signed URL (1 hour expiry)
        const signedUrl = getSignedVideoUrl(videoPublicId, 3600);

        console.log('🎬 Generated video URL successfully');

        res.json({
            status: 'success',
            data: { url: signedUrl },
        });
    } catch (err) {
        console.error('❌ Video URL generation error:', err);
        next(err);
    }
});

/**
 * GET /api/upload/image/:publicId
 * Get optimized image URL
 * Public endpoint (images are not protected)
 * Note: publicId may contain slashes, so we use a query param instead
 */
router.get('/image', (req, res) => {
    const publicId = req.query.id as string;
    if (!publicId) {
        return res.status(400).json({ status: 'error', message: 'Missing publicId' });
    }
    const width = req.query.w ? parseInt(req.query.w as string) : undefined;
    const height = req.query.h ? parseInt(req.query.h as string) : undefined;

    const url = getImageUrl(publicId, { width, height });
    res.json({ status: 'success', data: { url } });
});

export default router;
