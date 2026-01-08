import { Router } from 'express';
import { createCourseHandler, getCoursesHandler, getCourseHandler, updateCourseHandler, deleteCourseHandler } from './course.controller';
import validate from '../../middleware/validateResource';
import { createCourseSchema, updateCourseSchema } from './course.schema';
import { requireUser } from '../../middleware/requireUser';
import { requireAdmin } from '../../middleware/requireAdmin';

const router = Router();

// Public routes
router.get('/', getCoursesHandler);
router.get('/:courseId', getCourseHandler);

// Admin-only routes (require both user auth and admin role)
router.post('/', requireUser, requireAdmin, validate(createCourseSchema), createCourseHandler);
router.put('/:courseId', requireUser, requireAdmin, validate(updateCourseSchema), updateCourseHandler);
router.delete('/:courseId', requireUser, requireAdmin, deleteCourseHandler);

export default router;
