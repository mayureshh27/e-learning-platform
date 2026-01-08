import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

export const deserializeUser = (req: Request, res: Response, next: NextFunction) => {
    let accessToken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        accessToken = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.accessToken) {
        accessToken = req.cookies.accessToken;
    }

    if (!accessToken) {
        return next();
    }

    const decoded = verifyJwt(accessToken, 'JWT_SECRET');

    if (decoded) {
        res.locals.user = decoded;
    }

    return next();
};
