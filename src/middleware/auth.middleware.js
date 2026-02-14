import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { COOKIE_NAME } from "../config/constants.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies[COOKIE_NAME];

    if (!process.env.JWT_SECRET) {
        return next(new ErrorHandler(500, "JWT_SECRET is not defined in environment variables"));
    }

    try {
        if (!token) {
            console.log("No token provided!");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error instanceof ErrorHandler) {
            return next(error);
        }
        console.log("Invalid token!");
        // return next(new ErrorHandler(401, "Unauthorized! Invalid token."));
    }
}