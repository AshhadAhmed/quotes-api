import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Quote from '../models/quote.model.js';
import User from '../models/user.model.js';

const defaultQuotes = [
    { quote: 'The best thing to hold onto in life is each other.', author: 'Audrey Hepburn', category: 'love' },
    { quote: "Your time is limited, so don't waste it living someone else's life.", author: 'Steve Jobs', category: 'motivation' },
    { quote: "Opportunities don't happen, you create them.", author: 'Chris Grosser', category: 'success' },
    { quote: "It always seems impossible until it's done.", author: 'Nelson Mandela', category: 'inspiration' },
    { quote: 'It is never too late to be what you might have been.', author: 'George Eliot', category: 'general' },
];

const connectDB = async MONGODB_URI => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        let [admin, quoteCount] = await Promise.all([
            User.findOne({ role: 'admin' }),
            Quote.countDocuments(),
        ]);

        if (!admin) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            admin = await User.create({
                role: 'admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
            });

            console.log('Admin user created.');
        } else {
            console.log('Admin user already exists.');
        }

        if (quoteCount === 0) {
            await Quote.insertMany(
                defaultQuotes.map(quote => ({
                    ...quote,
                    createdBy: admin._id,
                }))
            );

            console.log('Default quotes added to the database.');
        } else {
            console.log('Quotes already exist, skipping insertion.');
        }
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

export default connectDB;
