import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRATION_TIME, JWT_SECRET } from '../config/env.js';
import User from "../models/user.model.js";
import HttpError from "../utils/http-error.js";

export const SignIn = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new HttpError('Missing required fields', 400);
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

        // payload (data to be included in the token)
        const payload = {
            id: user._id,
            role: user.role
        };
        // generate JWT token
        const token = jwt.sign(
            payload, 
            JWT_SECRET, // secret key to be used in the signing process
            { expiresIn: JWT_EXPIRATION_TIME } // token expiration time
        );

        res.status(200).json({
            success: true,
            message: 'Signed in successfully',
            data: { token, user }
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
};

export const SignUp = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new HttpError('Missing required fields', 400);
        }

        // check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new HttpError('The email address is taken', 409);
        }
        // hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ email, password: hashedPassword });

        if (password.length < 6) {
            throw new HttpError('Password must be at least 6 characters long', 400);
        }
        await user.save();

        // generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION_TIME }
        );

        res.status(201).json({
            success: true,
            message: 'Signed up successfully',
            data: { token, user }
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
};