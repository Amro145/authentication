import express from 'express';
import bodyParser from 'body-parser';
import connectToDb from './src/config/db.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { ErrorHandler } from './src/utils/ErrorHandler.js';
import authRoutes from "./src/routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(morgan('dev'));

// Routes
app.use("/", authRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    let { statusCode, message } = err;

    if (!(err instanceof ErrorHandler)) {
        statusCode = statusCode || 500;
        message = message || "Internal Server Error";
    }

    res.status(statusCode).json({
        success: false,
        message,
        data: null
    });
});

const startServer = async () => {
    try {
        await connectToDb();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error.message);
        process.exit(1);
    }
};

startServer();