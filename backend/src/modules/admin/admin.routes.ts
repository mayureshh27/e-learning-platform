import { Router } from 'express';
import { getAllUsersHandler, getAllEnrollmentsHandler, getReportsHandler } from './admin.controller';
import { requireUser } from '../../middleware/requireUser';
import { requireAdmin } from '../../middleware/requireAdmin';

const router = Router();

// All admin routes require authentication AND admin role
router.use(requireUser);
router.use(requireAdmin);

router.get('/users', getAllUsersHandler);
router.get('/enrollments', getAllEnrollmentsHandler);
router.get('/reports', getReportsHandler);

export default router;
