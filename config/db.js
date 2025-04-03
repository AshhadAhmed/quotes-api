import mongoose from 'mongoose';
import Quote from '../models/quote.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

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

        let admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);

            admin = await User.create({ role: 'admin', email: 'admin@gmail.com', password: hashedPassword });
            console.log('Admin user created.');
        } else {
            console.log('Admin user already exists.');
        }

        const quoteCount = await Quote.countDocuments();

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

    process.on('SIGINT', async () => {
        console.log('SIGINT received. Closing MongoDB connection.');
        await mongoose.connection.close();
        process.exit(0);
    });
}

export default connectDB;

