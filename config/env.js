import { config } from 'dotenv';

config({ path: '.env' });

export const {
    PORT,
    MONGODB_URI,
    JWT_SECRET,
    JWT_EXPIRATION,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRATION,
} = process.env;
