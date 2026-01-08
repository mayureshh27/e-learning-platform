import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import logger from '../utils/logger';

const validate = (schema: z.ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e: any) {
        // Log validation errors for debugging
        logger.warn({
            msg: 'Validation failed',
            path: req.path,
            method: req.method,
            body: req.body,
            errors: e.errors,
        });
        return res.status(400).json({
            status: 'fail',
            message: 'Validation failed',
            errors: e.errors,
        });
    }
};

export default validate;
