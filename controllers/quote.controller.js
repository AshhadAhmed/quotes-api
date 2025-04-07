import { Types } from 'mongoose';
import Quote from '../models/quote.model.js';
import HttpError from '../utils/HttpError.js';

const withTimeout = function (handler, time = 10000) {
    return async (req, res, next) => {
        const timeout = setTimeout(() => {
            if (!res.headersSent) {
                return res.status(408).json({ success: false, message: 'Request timed out' });
            }
        }, time)

        try {
            await handler(req, res, next);
        } catch (err) {
            clearTimeout(timeout);
        }
    };
}

// GET api/v1/quotes (get all quotes)
export const getAllQuotes = withTimeout(async (req, res) => {
    try {
        const { category } = req.query;
        const categories = Quote.schema.path('category').enumValues;

        if (category && !categories.includes(category)) {
            throw new HttpError('Invalid category', 400);
        }

        const quotes = await Quote.find(category ? { category } : {});

        return res.json({ success: true, quotes });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
}, 8000);

// GET api/v1/quotes/random (get a random quote)
export const getRandomQuote = async (req, res) => {
    try {
        const [quote] = await Quote.aggregate([{ $sample: { size: 1 } }]);

        if (!quote) {
            throw new HttpError('No quotes found', 404);
        }
        res.json({ success: true, quote: quote });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
};

// GET api/v1/quotes/random/category?category=X (get a random quote by category)
export const getRandomQuoteByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        const categories = Quote.schema.path('category').enumValues;

        if (category && !categories.includes(category)) {
            throw new HttpError('Invalid category', 400);
        }

        const [quote] = await Quote.aggregate([
            { $match: { category } },
            { $sample: { size: 1 } }
        ]);

        if (!quote) {
            throw new HttpError('No quotes found', 404);
        }
        res.json({ success: true, quote: quote });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
};

// POST api/v1/quotes (add a new quote (authentication required)) 
export const addQuote = async (req, res) => {
    try {
        const { quote, author, category } = req.body;
        const categories = Quote.schema.path('category').enumValues;

        if (!quote || !author) {
            throw new HttpError('Missing quote or author', 400);
        }

        if (category && !categories.includes(category)) {
            throw new HttpError('Invalid category', 400);
        }
        const existingQuote = await Quote.findOne({ quote });

        if (existingQuote) {
            throw new HttpError('This quote already exists', 400);
        }

        const newQuote = await Quote.create({ quote, author, category, createdBy: req.user.id });
        res.status(201).json({ success: true, message: 'Quote added successfully', newQuote });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
};

// PUT api/v1/quotes/:id (update an existing quote)
export const updateQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const { quote, author, category } = req.body;
        const categories = Quote.schema.path('category').enumValues;

        if (!Types.ObjectId.isValid(id)) {
            throw new HttpError('Invalid ID', 400);
        }

        if (category && !categories.includes(category)) {
            throw new HttpError('Invalid category', 400);
        }

        if (!quote && !author && !category) {
            throw new HttpError('No valid fields to update', 400);
        }

        const updatedQuote = await Quote.findByIdAndUpdate(
            id,
            { quote, author, category },
            { new: true, runValidators: true }
        );

        if (!updatedQuote) {
            throw new HttpError('Quote not found', 404);
        }
        res.json({ success: true, message: 'Quote updated successfully', quote: updatedQuote });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
};

// DELETE api/v1/quotes/:id (delete a quote)
export const deleteQuote = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) {
            throw new HttpError('Invalid ID', 400);
        }

        const deletedQuote = await Quote.findByIdAndDelete(id);

        if (!deletedQuote) {
            throw new HttpError('Quote not found', 404);
        }
        res.json({ success: true, message: 'Quote deleted successfully', quote: deletedQuote });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
};
