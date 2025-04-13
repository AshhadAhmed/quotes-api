import { Router } from 'express';
import { deleteAccount, signIn, signOut, signUp } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/logout', signOut);
router.delete('/delete', authenticate, deleteAccount);

export default router;
