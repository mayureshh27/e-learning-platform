import { Router } from 'express';
import { enrollUserHandler, getMyEnrollmentsHandler, updateProgressHandler } from './enrollment.controller';
import validate from '../../middleware/validateResource';
import { createEnrollmentSchema, updateProgressSchema } from './enrollment.schema';
import { requireUser } from '../../middleware/requireUser';

const router = Router();

router.use(requireUser);

router.post('/', validate(createEnrollmentSchema), enrollUserHandler);
router.get('/me', getMyEnrollmentsHandler);
router.put('/:courseId/progress', validate(updateProgressSchema), updateProgressHandler);

export default router;
