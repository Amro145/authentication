import jwt from "jsonwebtoken";
import { ErrorHandler } from "../src/utils/ErrorHandler.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!process.env.JWT_SECRET) {
        return next(new ErrorHandler(500, "JWT_SECRET is not defined in environment variables"));
    }

    try {
        if (!token) {
            throw new ErrorHandler(401, "Unauthorized! No token provided.");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error instanceof ErrorHandler) {
            return next(error);
        }
        return next(new ErrorHandler(401, "Unauthorized! Invalid token."));
    }
}