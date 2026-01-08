import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Enrollment from '../../models/enrollment.model';
import Course from '../../models/course.model';
import AppError from '../../utils/AppError';

/**
 * Enroll a user in a course
 */
export const enrollUserHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;
        if (!user) return next(new AppError('Unauthorized', 401));

        const { courseId } = req.body;

        // Validate ObjectId format
        if (!Types.ObjectId.isValid(courseId)) {
            return next(new AppError('Invalid course ID', 400));
        }

        const userObjectId = new Types.ObjectId(user.sub);
        const courseObjectId = new Types.ObjectId(courseId);

        const existing = await Enrollment.findOne({
            user: userObjectId,
            course: courseObjectId,
        });

        if (existing) {
            return next(new AppError('Already enrolled', 400));
        }

        const enrollment = await Enrollment.create({
            user: userObjectId,
            course: courseObjectId,
        });

        res.status(201).json({ status: 'success', data: enrollment });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all enrollments for the authenticated user
 */
export const getMyEnrollmentsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;
        if (!user) return next(new AppError('Unauthorized', 401));

        const userObjectId = new Types.ObjectId(user.sub);

        const enrollments = await Enrollment.find({ user: userObjectId }).populate(
            'course'
        );

        res.status(200).json({
            status: 'success',
            results: enrollments.length,
            data: enrollments,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Update lesson progress for an enrollment
 */
export const updateProgressHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;
        if (!user) return next(new AppError('Unauthorized', 401));

        const { lessonId, completed } = req.body;
        const { courseId } = req.params;

        // Validate ObjectId formats
        if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(lessonId)) {
            return next(new AppError('Invalid ID format', 400));
        }

        const userObjectId = new Types.ObjectId(user.sub);
        const courseObjectId = new Types.ObjectId(courseId);
        const lessonObjectId = new Types.ObjectId(lessonId);

        const enrollment = await Enrollment.findOne({
            user: userObjectId,
            course: courseObjectId,
        });

        if (!enrollment) {
            return next(new AppError('Not enrolled in this course', 404));
        }

        if (completed) {
            // Add lesson if not already completed
            const alreadyCompleted = enrollment.completedLessons.some((id) =>
                id.equals(lessonObjectId)
            );
            if (!alreadyCompleted) {
                enrollment.completedLessons.push(lessonObjectId);
            }
        } else {
            // Remove lesson from completed
            enrollment.completedLessons = enrollment.completedLessons.filter(
                (id) => !id.equals(lessonObjectId)
            );
        }

        // Recalculate progress percentage
        const course = await Course.findById(courseObjectId);
        if (course) {
            let totalLessons = 0;
            course.modules.forEach((m) => (totalLessons += m.lessons.length));

            if (totalLessons > 0) {
                enrollment.progress = Math.round(
                    (enrollment.completedLessons.length / totalLessons) * 100
                );
                enrollment.isCompleted = enrollment.progress === 100;
            }
        }

        await enrollment.save();

        res.status(200).json({ status: 'success', data: enrollment });
    } catch (err) {
        next(err);
    }
};
