import express from 'express';
import connectToDb from './src/config/db.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { ErrorHandler } from './src/utils/ErrorHandler.js';
import authRoutes from "./src/routes/auth.route.js";
import { setupSwagger } from './src/config/swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/signup", limiter);
app.use("/signin", limiter);
app.use("/verify-email", limiter);
app.use("/forgot-password", limiter);
app.use("/reset-password", limiter);
app.use("/resend-verification", limiter);

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('dev'));

// Swagger Documentation
setupSwagger(app);

// Routes
app.use("/", authRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    let { statusCode, message } = err;

    // Default values
    statusCode = statusCode || 500;
    message = message || "Internal Server Error";

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
    }

    // Handle Mongoose Cast Error (Invalid ID)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Resource not found. Invalid: ${err.path}`;
    }

    // Handle JWT Errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your session has expired. Please log in again.';
    }

    if (!(err instanceof ErrorHandler)) {
        // Log unexpected errors for developers
        console.error(`[Unexpected Error]: ${err.stack || err.message}`);
    }

    res.status(statusCode).json({
        success: false,
        message,
        data: null,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const startServer = async () => {
    try {
        await connectToDb();
        // Only call listen if not running as a serverless function
        if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error('Failed to start the server:', error.message);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

startServer();

export default app;