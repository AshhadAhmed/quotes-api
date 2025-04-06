import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Quote from '../models/quote.model.js';
import User from '../models/user.model.js';

const defaultQuotes = [
    // motivation
    { quote: 'Success is not final, failure is not fatal: It is the courage to continue that counts.', author: 'Winston Churchill', category: 'motivation' },
    { quote: 'Your time is limited, so don\'t waste it living someone else\'s life.', author: 'Steve Jobs', category: 'motivation' },
    { quote: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt', category: 'motivation' },
    { quote: 'What you get by achieving your goals is not as important as what you become by achieving your goals.', author: 'Zig Ziglar', category: 'motivation' },
    { quote: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', category: 'motivation' },

    // love
    { quote: 'To love and be loved is to feel the sun from both sides.', author: 'David Viscott', category: 'love' },
    { quote: 'The best thing to hold onto in life is each other.', author: 'Audrey Hepburn', category: 'love' },
    { quote: 'In the end, the love you take is equal to the love you make.', author: 'Paul McCartney', category: 'love' },
    { quote: 'We loved with a love that was more than love.', author: 'Edgar Allan Poe', category: 'love' },
    { quote: 'The greatest thing you\'ll ever learn is just to love and be loved in return.', author: 'Eden Ahbez', category: 'love' },

    // success
    { quote: 'Success usually comes to those who are too busy to be looking for it.', author: 'Henry David Thoreau', category: 'success' },
    { quote: 'The only place where success comes before work is in the dictionary.', author: 'Vidal Sassoon', category: 'success' },
    { quote: 'Success is not how high you have climbed, but how you make a positive difference to the world.', author: 'Roy T. Bennett', category: 'success' },
    { quote: 'Opportunities don\'t happen, you create them.', author: 'Chris Grosser', category: 'success' },
    { quote: 'Success is walking from failure to failure with no loss of enthusiasm.', author: 'Winston Churchill', category: 'success' },

    // inspiration
    { quote: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky', category: 'inspiration' },
    { quote: 'It always seems impossible until it\'s done.', author: 'Nelson Mandela', category: 'inspiration' },
    { quote: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'inspiration' },
    { quote: 'Act as if what you do makes a difference. It does.', author: 'William James', category: 'inspiration' },
    { quote: 'The best way to predict the future is to create it.', author: 'Abraham Lincoln', category: 'inspiration' },

    // general
    { quote: 'The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.', author: 'Ralph Waldo Emerson', category: 'general' },
    { quote: 'Success is not how high you have climbed, but how you make a positive difference to the world.', author: 'Roy T. Bennett', category: 'general' },
    { quote: 'You only live once, but if you do it right, once is enough.', author: 'Mae West', category: 'general' },
    { quote: 'You have within you right now, everything you need to deal with whatever the world can throw at you.', author: 'Brian Tracy', category: 'general' },
    { quote: 'It is never too late to be what you might have been.', author: 'George Eliot', category: 'general' }
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