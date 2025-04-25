import { isValidObjectId } from 'mongoose';
import Quote from '../models/quote.model.js';
import HttpError from '../utils/HttpError.js';

// GET api/v1/quotes (get all quotes)
export const getAllQuotes = async (req, res, next) => {
    const { category } = req.query;
    const categories = Quote.schema.path('category').enumValues;

    if (category && !categories.includes(category))
        next(new HttpError('Invalid category', 400));

    const quotes = await Quote.find(category ? { category } : {});
    res.json({ success: true, quotes });
};

// GET api/v1/quotes/random (get a random quote)
export const getRandomQuote = async (req, res, next) => {
    const [quote] = await Quote.aggregate([{ $sample: { size: 1 } }]);

    if (!quote) next(new HttpError('No quotes found', 404));
    res.json({ success: true, quote: quote });
};

// GET api/v1/quotes/random/category?category=X (get a random quote by category)
export const getRandomQuoteByCategory = async (req, res, next) => {
    const { category } = req.query;
    const categories = Quote.schema.path('category').enumValues;

    if (category && !categories.includes(category))
        next(new HttpError('Invalid category', 400));

    const [quote] = await Quote.aggregate([
        { $match: { category } },
        { $sample: { size: 1 } },
    ]);

    if (!quote) next(new HttpError('No quotes found', 404));
    res.json({ success: true, quote: quote });
};

// POST api/v1/quotes (add a new quote)
export const addQuote = async (req, res, next) => {
    const { quote, author, category } = req.body;
    const categories = Quote.schema.path('category').enumValues;

    if (!quote || !author) next(new HttpError('Missing quote or author', 400));

    if (category && !categories.includes(category))
        next(new HttpError('Invalid category', 400));

    const existingQuote = await Quote.findOne({ quote });

    if (existingQuote) next(new HttpError('This quote already exists', 400));
    await Quote.create({
        quote,
        author,
        category,
        createdBy: req.user.id,
    });
    res.status(201).json({ success: true, message: 'Quote added successfully' });
};

// PATCH api/v1/quotes/:id (update an existing quote)
export const updateQuote = async (req, res, next) => {
    const { id } = req.params;
    const { quote, author, category } = req.body;
    const categories = Quote.schema.path('category').enumValues;

    if (!isValidObjectId(id)) next(new HttpError('Invalid ID', 400));

    if (category && !categories.includes(category))
        next(new HttpError('Invalid category', 400));

    if (!quote && !author && !category)
        next(new HttpError('No valid fields to update', 400));

    const updatedQuote = await Quote.findByIdAndUpdate(
        id,
        { quote, author, category },
        { new: true, runValidators: true }   // return the updated document and run validation
    );

    if (!updatedQuote) next(new HttpError('Quote not found', 404));
    res.json({
        success: true,
        message: 'Quote updated successfully',
        quote: updatedQuote,
    });
};

// DELETE api/v1/quotes/:id (delete a quote)
export const deleteQuote = async (req, res, next) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) next(new HttpError('Invalid ID', 400));

    const deletedQuote = await Quote.findByIdAndDelete(id);

    if (!deletedQuote) next(new HttpError('Quote not found', 404));
    res.json({ success: true, message: 'Quote deleted successfully' });
};
