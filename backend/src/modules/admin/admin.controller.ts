import { Request, Response, NextFunction } from 'express';
import User from '../../models/user.model';
import Enrollment from '../../models/enrollment.model';
import AppError from '../../utils/AppError';

/**
 * Get all users (Admin only)
 */
export const getAllUsersHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: users,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all enrollments (Admin only)
 */
export const getAllEnrollmentsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const enrollments = await Enrollment.find()
            .populate('user', 'name email')
            .populate('course', 'title slug');
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
 * Get basic reports (Admin only)
 */
export const getReportsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();
        const completedEnrollments = await Enrollment.countDocuments({ isCompleted: true });

        res.status(200).json({
            status: 'success',
            data: {
                totalUsers,
                totalEnrollments,
                completedEnrollments,
                completionRate: totalEnrollments > 0
                    ? Math.round((completedEnrollments / totalEnrollments) * 100)
                    : 0,
            },
        });
    } catch (err) {
        next(err);
    }
};
