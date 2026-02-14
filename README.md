# Authentication System - Backend

This is the backend service for the V3 Authentication System. It provides a robust, secure, and scalable API for user authentication and management, built with Node.js, Express, and MongoDB.

## Features

- **Scalable Architecture**: Modular structure for easy maintenance and expansion.
- **Secure Authentication**: JWT-based authentication with HttpOnly cookies.
- **High Security**: Bcrypt for password hashing, Helmet for security headers, and Rate Limiting to prevent brute-force attacks.
- **Email Service**: Integrated with **Resend** for reliable email delivery (Verification, Welcome, and Password Reset).
- **API Documentation**: Built-in Swagger documentation for easy endpoint testing.
- **User Management**: Specialized routes for user deletion and data retrieval.

## Technologies Used

- **Node.js**: Runtime environment.
- **Express.js**: Web framework.
- **MongoDB & Mongoose**: Database and ODM.
- **JWT (JsonWebToken)**: Secure authentication tokens.
- **Resend**: Modern email delivery API.
- **Bcrypt**: Industrial-strength password hashing.
- **Helmet**: Security middleware.
- **Morgan**: HTTP request logger.
- **Swagger**: API documentation.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB instance (Atlas or Local)
- Resend API Key

## Installation

1. Navigate to the authentication directory:
   ```bash
   cd authentication
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file based on `.env.example`:
   ```env
   DATABASE_URL=your_mongodb_uri
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_key
   RESEND_API_KEY=re_your_api_key
   CLIENT_URL=http://localhost:5173
   ```

4. Start the server:
   ```bash
   npm run dev  # For development with nodemon
   # OR
   npm start    # For production
   ```

## API Endpoints

### Auth Routes
- `POST /signup`: Register a new account.
- `POST /signin`: Authenticate and receive a secure cookie.
- `POST /logout`: Clear the authentication cookie.
- `POST /verify-email`: Verify account using a 6-digit code.
- `POST /resend-verification`: Resend the email verification code.
- `POST /forgot-password`: Send a password reset link.
- `POST /reset-password/:token`: Reset password using a valid token.
- `GET /check-auth`: Verify current session and fetch user data.

### Admin/Management
- `GET /getall`: List all users.
- `DELETE /delete/:userId`: Remove a user from the system.

## Documentation
Once the server is running, visit `http://localhost:3000/api-docs` to view the full Swagger API documentation.

## License
ISC License
