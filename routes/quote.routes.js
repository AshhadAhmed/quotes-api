import { Router } from 'express';
import {
    addQuote,
    deleteQuote,
    getAllQuotes,
    getRandomQuote,
    getRandomQuoteByCategory,
    updateQuote
} from '../controllers/quote.controller.js';

const router = Router();

router.route('/').get(getAllQuotes).post(addQuote);
router.get('/random', getRandomQuote);
router.get('/random/category', getRandomQuoteByCategory);
router.route('/:id').put(updateQuote).delete(deleteQuote);

export default router;