import { Router } from 'express';
import { SignIn, SignUp } from '../controllers/auth.controller.js';

const router = Router();

router.post('/signin', SignIn);
router.post('/signup', SignUp);

export default router;