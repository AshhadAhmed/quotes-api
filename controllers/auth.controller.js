import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import {
    JWT_EXPIRATION,
    JWT_SECRET,
    REFRESH_TOKEN_EXPIRATION,
    REFRESH_TOKEN_SECRET,
} from '../config/env.js';
import Quote from '../models/quote.model.js';
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
        const newAccessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION,
        });

        // update the refresh token
        const newRefreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRATION,
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            success: true,
            message: 'Signed in successfully',
            data: { token: newAccessToken, user },
        });
    } catch (err) {
        res
            .status(err.statusCode || 500)
            .json({ success: false, message: err.message || 'Internal Server Error' });
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
        const accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRATION,
        });

        // generate the refresh token
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRATION,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: { token: accessToken, user },
        });
    } catch (err) {
        res
            .status(err.statusCode || 500)
            .json({ success: false, message: err.message || 'Internal Server Error' });
    }
};

export const signOut = function (req, res) {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
    });

    return res.json({ success: true, message: 'Signed out successfully' });
};

export const deleteAccount = async function (req, res) {
    try {
        if (!req.user || !req.user.id) {
            throw new HttpError('Unauthorized', 401);
        }

        const { id, role } = req.user;   // get the user ID and role from the auth middleware

        if (!isValidObjectId(id)) {
            throw new HttpError('Invalid ID', 400);
        }

        if (role === 'admin') {
            throw new HttpError('Admin account cannot be deleted', 403);
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            throw new HttpError('User not found', 404);
        }

        // delete related quotes by user
        await Quote.deleteMany({ createdBy: id });

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (err) {
        res
            .status(err.statusCode || 500)
            .json({ success: false, message: err.message || 'Internal Server Error' });
    }
};
