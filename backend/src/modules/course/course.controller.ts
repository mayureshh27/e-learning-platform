import { Request, Response, NextFunction } from 'express';
import { CreateCourseInput, UpdateCourseParams, UpdateCourseBody } from './course.schema';
import Course from '../../models/course.model';
import AppError from '../../utils/AppError';

export const createCourseHandler = async (
    req: Request<{}, {}, CreateCourseInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;
        if (!user) return next(new AppError('Unauthorized', 401));

        // Slug generation (simple version)
        const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

        const course = await Course.create({
            ...req.body,
            slug,
            instructor: user.sub, // JWT payload has sub
        });

        res.status(201).json({ status: 'success', data: course });
    } catch (err) {
        next(err);
    }
};

export const getCoursesHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const queryObj = { ...req.query } as any;
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Course.find(JSON.parse(queryStr));

        // Search - using regex for partial matching (case-insensitive)
        if (req.query.search) {
            const searchTerm = req.query.search as string;
            // Escape special regex characters to prevent injection
            const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const searchRegex = new RegExp(escapedSearch, 'i');
            query = query.find({
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { category: searchRegex },
                ],
            });
        }

        const courses = await query.populate('instructor', 'name email');

        res.status(200).json({ status: 'success', results: courses.length, data: courses });
    } catch (err) {
        next(err);
    }
};

export const getCourseHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('instructor', 'name email');
        if (!course) {
            return next(new AppError('No course with that ID', 404));
        }
        res.status(200).json({ status: 'success', data: course });
    } catch (err) {
        next(err);
    }
};

export const updateCourseHandler = async (
    req: Request<UpdateCourseParams, {}, UpdateCourseBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
            new: true,
            runValidators: true
        });
        if (!course) {
            return next(new AppError('No course with that ID', 404));
        }
        res.status(200).json({ status: 'success', data: course });
    } catch (err) {
        next(err);
    }
}

export const deleteCourseHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.courseId);
        if (!course) {
            return next(new AppError('No course with that ID', 404));
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        next(err);
    }
};
