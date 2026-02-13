import jwt from 'jsonwebtoken';
import { COOKIE_NAME, TOKEN_EXPIRY } from '../config/constants.js';

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: true, // Required for SameSite: 'None'
        sameSite: 'None', // Allow cross-site cookies
        maxAge: TOKEN_EXPIRY,
    });

    return token;
};
