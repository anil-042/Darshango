import { Router } from 'express';
import * as authController from './auth.controller';
import { validate, registerSchema, loginSchema } from '../../utils/validators';

const router = Router();

router.post('/signup', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;
