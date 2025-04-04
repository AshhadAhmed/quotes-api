import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.js";
import Quote from "../models/quote.model.js";
import HttpError from "../utils/httpError.js";

const authenticate = function (req, res, next) {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            throw new HttpError('Unauthorized', 401);
        }
        // Authorization: Bearer <token>
        const token = authHeader.split(' ')[1];

        /*
            the signature is created using a cryptographic algorithm (e.g., HS256) and the secret key. If 
            signature is valid and the token is not expired, the decoded payload is returned. Otherwise if 
            signature is invalid or the token is expired/incorrect, an error is thrown

            HOW VERIFICATION WORKS:
            1. The header and payload are extracted from the token.
            2. A new signature is generated using the same algorithm and JWT_SECRET.
            3. The new signature is compared with the token’s original signature.
            4. If they match, the token is valid. Otherwise, an error is thrown.
        */
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
                throw new HttpError('Token expired or invalid', 403);
            }
            req.user = decodedToken;    // attach the decoded object to the request
            next();
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal Server Error' });
    }
};

const isResourceOwner = async function (req, res, next) {
    try {
        const quote = await Quote.findById(req.params.id);

        if (!quote) {
            throw new HttpError('Quote not found', 404);
        }

        if (req.user.role === 'admin' && quote.createdBy.toString() !== req.user.id) {
            throw new HttpError('Forbidden', 403);
        }

        if (req.user.role === 'user' && quote.createdBy.toString() !== req.user.id) {
            throw new HttpError('Forbidden', 403);
        }
        next();
    } catch (err) {
        res.status(err.statusCode).json({ success: false, message: err.message });
    }
};

export { authenticate, isResourceOwner };

