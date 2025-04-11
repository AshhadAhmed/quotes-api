import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import connectDB from './config/db.js';
import { MONGODB_URI, PORT } from './config/env.js';
import { notFound } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import quoteRoutes from './routes/quote.routes.js';
import refreshTokenRoute from './routes/token.routes.js';

const app = express();

app.use(helmet());
app.use(hpp());

connectDB(MONGODB_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/quotes', quoteRoutes);
app.use('/api/v1', refreshTokenRoute);

app.use(notFound);

app.listen(PORT || 3000, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
