import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
        return next(new AppError('You are not logged in', 401));
    }

    return next();
};
