import jwt from 'jsonwebtoken';
import { JWT_EXPIRATION_TIME, JWT_SECRET, REFRESH_TOKEN_SECRET } from '../config/env.js';
import HttpError from '../utils/http-error.js';

const refreshtoken = async function (req, res) {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            throw new HttpError('Missing refresh token', 400);
        }
        // verify the refresh token
        const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        if (!decodedToken) {
            throw new HttpError('Invalid refresh token', 403);
        }

        const payload = { id: decodedToken.id, role: decodedToken.role };

        // generate JWT token
        const accessToken = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION_TIME }
        );

        // generate a new refresh token
        const newRefreshToken = jwt.sign(
            payload,
            REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME }
        );

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ success: true, token: accessToken });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
};

export default refreshtoken;