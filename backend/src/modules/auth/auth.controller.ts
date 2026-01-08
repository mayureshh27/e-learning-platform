import { Request, Response, NextFunction } from 'express';
import { CreateUserInput, LoginUserInput } from './auth.schema';
import User from '../../models/user.model';
import AppError from '../../utils/AppError';
import { signJwt } from '../../utils/jwt';
import logger from '../../utils/logger';

// Cookie options
const accessTokenCookieOptions = {
    maxAge: 15 * 60 * 1000, // 15 mins
    httpOnly: true,
    domain: 'localhost', // Set to your domain in production
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const
};

const refreshTokenCookieOptions = {
    ...accessTokenCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const registerHandler = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, password } = req.body;

        logger.info({ msg: 'Signup attempt', email, name });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn({ msg: 'Email already in use', email });
            return next(new AppError('Email already in use', 409));
        }

        const user = await User.create({ name, email, password });
        logger.info({ msg: 'User created successfully', userId: user._id, email });

        // Create Access and Refresh tokens
        const accessToken = signJwt({ sub: user._id, role: user.role }, 'JWT_SECRET', { expiresIn: '15m' });
        const refreshToken = signJwt({ sub: user._id, role: user.role }, 'JWT_REFRESH_SECRET', { expiresIn: '7d' });

        // Send cookies
        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        res.status(201).json({
            status: 'success',
            data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken }
        });
    } catch (err) {
        logger.error({ msg: 'Signup error', error: err });
        next(err);
    }
};

export const loginHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        logger.info({ msg: 'Login attempt', email });

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            logger.warn({ msg: 'Invalid credentials', email });
            return next(new AppError('Invalid email or password', 401));
        }

        logger.info({ msg: 'Login successful', userId: user._id, email });

        // Create Access and Refresh tokens
        const accessToken = signJwt({ sub: user._id, role: user.role }, 'JWT_SECRET', { expiresIn: '15m' });
        const refreshToken = signJwt({ sub: user._id, role: user.role }, 'JWT_REFRESH_SECRET', { expiresIn: '7d' });

        // Send cookies
        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

        res.status(200).json({
            status: 'success',
            accessToken
        });
    } catch (err) {
        logger.error({ msg: 'Login error', error: err });
        next(err);
    }
};

export const logoutHandler = (req: Request, res: Response) => {
    logger.info({ msg: 'User logout' });
    res.cookie('accessToken', '', { maxAge: 1 });
    res.cookie('refreshToken', '', { maxAge: 1 });
    res.status(200).json({ status: 'success' });
}

export const getMeHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;
        if (!user) {
            logger.warn({ msg: 'Unauthorized /me access' });
            return next(new AppError('Not logged in', 401));
        }

        const foundUser = await User.findById(user.sub).select('-password');
        if (!foundUser) {
            logger.warn({ msg: 'User not found', userId: user.sub });
            return next(new AppError('User not found', 404));
        }

        logger.debug({ msg: 'User fetched', userId: foundUser._id });

        res.status(200).json({
            status: 'success',
            data: { user: foundUser }
        });
    } catch (err) {
        logger.error({ msg: 'GetMe error', error: err });
        next(err);
    }
};
