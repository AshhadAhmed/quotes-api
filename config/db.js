import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Quote from '../models/quote.model.js';
import User from '../models/user.model.js';

const defaultQuotes = [
    { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivation' },
    { quote: 'Love all, trust a few, do wrong to none.', author: 'William Shakespeare', category: 'love' },
    { quote: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson', category: 'success' },
    { quote: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', category: 'inspiration' },
    { quote: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon', category: 'general' },
];

const connectDB = async (MONGODB_URI) => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        let [admin, quoteCount] = await Promise.all([
            User.findOne({ role: 'admin' }),
            Quote.countDocuments()
        ]);

        if (!admin) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            admin = await User.create({ role: 'admin', email: 'admin@gmail.com', password: hashedPassword });

            console.log('Admin user created.');
        } else {
            console.log('Admin user already exists.');
        }

        if (quoteCount === 0) {
            await Quote.insertMany(defaultQuotes.map(quote => ({
                ...quote,
                createdBy: admin._id,
            })));

            console.log('Default quotes added to the database.');
        } else {
            console.log('Quotes already exist, skipping insertion.');
        }
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
}

export default connectDB;