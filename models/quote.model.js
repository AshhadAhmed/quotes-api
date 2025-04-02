import { Schema, model } from 'mongoose';

const quoteSchema = new Schema({
    quote: {
        type: String,
        required: true,
        trim: true,
        maxLength: [200, 'Quote cannot be longer than 200 characters'],
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
        enum: ['motivation', 'love', 'success', 'inspiration', 'general'],
        default: 'general'
    },
}, { versionKey: false, timestamps: true });

export default model('Quote', quoteSchema);