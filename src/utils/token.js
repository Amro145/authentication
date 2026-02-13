import jwt from 'jsonwebtoken';
import { COOKIE_NAME, TOKEN_EXPIRY } from '../config/constants.js';

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: TOKEN_EXPIRY,
    });

    return token;
};
