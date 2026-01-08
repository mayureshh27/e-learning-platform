import { Router } from 'express';
import { registerHandler, loginHandler, logoutHandler, getMeHandler } from './auth.controller';
import validate from '../../middleware/validateResource';
import { createUserSchema, loginUserSchema } from './auth.schema';
import { requireUser } from '../../middleware/requireUser';

const router = Router();

router.post('/signup', validate(createUserSchema), registerHandler);
router.post('/login', validate(loginUserSchema), loginHandler);
router.post('/logout', logoutHandler);
router.get('/me', requireUser, getMeHandler);

export default router;
