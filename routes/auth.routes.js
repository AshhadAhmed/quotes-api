import { Router } from 'express';
import { signIn, signUp, signOut } from '../controllers/auth.controller.js';

const router = Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/logout', signOut);

export default router;