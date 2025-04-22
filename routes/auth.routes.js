import { Router } from 'express';
import { deleteAccount, signIn, signOut, signUp } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/sign-in', signIn);
router.post('/sign-up', signUp);
router.post('/sign-out', signOut);
router.delete('/delete', authenticate, deleteAccount);

export default router;
