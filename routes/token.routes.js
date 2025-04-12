import { Router } from 'express';
import refreshToken from '../controllers/token.controller.js';

const router = Router();

router.post('/refresh-token', refreshToken);

export default router;
