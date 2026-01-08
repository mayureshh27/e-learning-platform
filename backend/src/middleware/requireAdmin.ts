import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

/**
 * Middleware to restrict access to admin users only
 */
export const requireAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = res.locals.user;

    if (!user) {
        return next(new AppError('Not logged in', 401));
    }

    if (user.role !== 'admin') {
        return next(new AppError('Access denied. Admin only.', 403));
    }

    next();
};
