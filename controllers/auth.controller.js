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

export const signIn = async function (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) next(new HttpError('Missing email or password', 400));
    const user = await User.findOne({ email });      // check if the user already exists

    if (!user) next(new HttpError('Invalid email address', 404));
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) next(new HttpError('Invalid password', 401));

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
    return res.json({
        success: true,
        message: 'Signed in successfully',
        data: { token: newAccessToken },
    });
};

export const signUp = async function (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) next(new HttpError('Missing email or password', 400));

    if (password.length < 6)
        next(new HttpError('Password must be at least 6 characters long', 400));

    const existingUser = await User.findOne({ email });
    if (existingUser) next(new HttpError('The email address already exists', 409));

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
    return res.status(201).json({
        success: true,
        message: 'Signed up successfully',
        data: { token: accessToken },
    });
};

export const signOut = function (req, res) {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
    });

    return res.json({ success: true, message: 'Signed out successfully' });
};

export const deleteAccount = async function (req, res, next) {
    if (!req.user || !req.user.id) next(new HttpError('Unauthorized', 401));

    const { id, role } = req.user;
    if (!isValidObjectId(id)) next(new HttpError('Invalid ID', 400));

    if (role === 'admin') next(new HttpError('Admin account cannot be deleted', 403));

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) next(new HttpError('User not found', 404));

    // delete related quotes by user
    await Quote.deleteMany({ createdBy: id });

    return res.json({ success: true, message: 'Account deleted successfully' });
};
