import { Router } from 'express';
import {
    addQuote,
    deleteQuote,
    getAllQuotes,
    getRandomQuote,
    getRandomQuoteByCategory,
    updateQuote
} from '../controllers/quote.controller.js';
import { authenticate, isResourceOwner } from '../middlewares/auth.middleware.js';

const router = Router();
const authMiddleware = [authenticate, isResourceOwner];

router.route('/').get(getAllQuotes).post(authenticate, addQuote);
router.get('/random', getRandomQuote);
router.get('/random/category', getRandomQuoteByCategory);
router.route('/:id').put(...authMiddleware, updateQuote).delete(...authMiddleware, deleteQuote);

export default router;