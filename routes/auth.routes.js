import { Router } from 'express';
import { signIn, signOut, signUp } from '../controllers/auth.controller.js';

const router = Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/logout', signOut);

export default router;