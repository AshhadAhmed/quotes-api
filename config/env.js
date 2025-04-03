import { config } from 'dotenv';

config({ path: '.env' });

export const {
    PORT,
    MONGODB_URI,
    JWT_SECRET,
    JWT_EXPIRATION_TIME,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRATION_TIME
} = process.env;