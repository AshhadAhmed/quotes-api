import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import connectDB from './config/db.js';
import { MONGODB_URI, PORT } from './config/env.js';
import { notFound } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import quoteRoutes from './routes/quote.routes.js';

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    handler: function (req, res) {
        res.status(429).json({
            message: 'You have exceeded the rate limit. Please try again later.',
            resetTime: new Date(Date.now() + this.windowMs).toLocaleString(),
        });
    }
});

app.use(limiter);
app.use(helmet());
app.use(hpp());

connectDB(MONGODB_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/quotes', quoteRoutes);

app.use(notFound);

app.listen(PORT || 3000, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
