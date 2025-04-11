import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    JWT_EXPIRATION_TIME,
    JWT_SECRET,
    REFRESH_TOKEN_EXPIRATION_TIME,
    REFRESH_TOKEN_SECRET
} from '../config/env.js';
import User from '../models/user.model.js';
import HttpError from '../utils/HttpError.js';

export const signIn = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new HttpError('Missing email or password', 400);
        }
        // check if the user already exists
        const user = await User.findOne({ email });

        if (!user) {
            throw new HttpError('Invalid email address', 404);
        }

        // compare the password with the hashed password in the database
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new HttpError('Invalid password', 401);
        }

        // payload (data to be transmitted)
        const payload = { id: user._id, role: user.role };

        // generate JWT token
        const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });

        // update the refresh token
        const newRefreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            message: 'Signed in successfully',
            data: { token: newAccessToken, user }
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
};

export const signUp = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new HttpError('Missing email or password', 400);
        }

        if (password.length < 6) {
            throw new HttpError('Password must be at least 6 characters long', 400);
        }

        // check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new HttpError('The email address already exists', 409);
        }
        // hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ email, password: hashedPassword });

        const payload = { id: user._id, role: user.role };

        // generate the access token
        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });

        // generate the refresh token
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: 'Signed up successfully',
            data: { token: accessToken, user }
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
};

export const signOut = function (req, res) {
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });

    return res.json({ success: true, message: 'Signed out successfully' })
};