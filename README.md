# Authentication System

This project is a comprehensive Node.js-based authentication system designed to provide secure and efficient user management. It is built with Express.js and MongoDB and includes features such as user registration, email verification, login, password reset, and user management. The system is designed to be scalable and easy to integrate into other applications.

## Purpose

The purpose of this project is to provide a robust authentication system that can be used as a standalone service or integrated into larger applications. It ensures secure user authentication and management using modern technologies and best practices.

## Features

- **User Registration**: Allows users to sign up with their email, password, and name.
- **Email Verification**: Ensures email addresses are verified using a time-sensitive verification token.
- **Login**: Authenticates users with email and password.
- **Password Reset**: Enables users to request and reset their passwords via email.
- **User Management**: Provides endpoints to fetch all users and delete users by ID.
- **Authentication Middleware**: Protects routes using JWT-based authentication.
- **Secure Cookies**: Stores authentication tokens securely in HTTP-only cookies.

## Technologies Used

- **Node.js**: Backend runtime.
- **Express.js**: Web framework.
- **MongoDB**: Database for storing user data.
- **Mongoose**: ODM for MongoDB.
- **JWT**: JSON Web Tokens for authentication.
- **Bcrypt**: Password hashing.
- **Mailtrap**: Email service for testing email functionality.
- **dotenv**: Environment variable management.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB instance (local or cloud)
- Mailtrap account for email testing

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd authentication
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:
   ```env
   DATABASE_URL=<your-mongodb-connection-string>
   API_KEY=<your-api-key>
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=<your-jwt-secret>
   MAILTRAP_TOKEN=<your-mailtrap-token>
   CLIENT_URL=http://localhost:5173
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. The server will run on `http://localhost:3000`.

## API Endpoints

### Authentication Routes

| Method | Endpoint                | Description                     |
|--------|--------------------------|---------------------------------|
| POST   | `/signup`               | Register a new user             |
| POST   | `/verify-email`         | Verify email address            |
| POST   | `/signin`               | Login user                      |
| POST   | `/logout`               | Logout user                     |
| POST   | `/forgot-password`      | Request password reset          |
| POST   | `/reset-password/:code` | Reset password                  |
| GET    | `/check-auth`           | Check user authentication       |

### User Management Routes

| Method | Endpoint         | Description                     |
|--------|-------------------|---------------------------------|
| GET    | `/getall`        | Fetch all users                 |
| DELETE | `/delete/:userId` | Delete a user by ID             |

## Project Structure

```
authentication/
├── src/
│   ├── config/            # Configuration and Constants
│   ├── controllers/       # Controller logic
│   ├── middleware/        # Custom middleware (Auth, Validation)
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # External services (Email)
│   └── utils/             # Helper functions and utilities
├── client/                # Frontend React application
├── .env                   # Environment variables
├── app.js                 # Main application entry point
├── package.json           # Project metadata and dependencies
└── README.md              # Project documentation
```

## Usage

1. **Sign Up**: Send a POST request to `/signup` with `email`, `password`, and `name`.
2. **Verify Email**: Use the verification token sent to your email to verify your account.
3. **Login**: Send a POST request to `/signin` with `email` and `password`.
4. **Forgot Password**: Request a password reset by sending your email to `/forgot-password`.
5. **Reset Password**: Use the reset token to reset your password via `/reset-password/:code`.

## Frontend Integration

The project includes a React-based frontend application located in the `client/` directory. It provides a user-friendly interface for interacting with the authentication system.

## License

This project is licensed under the ISC License.

## Author

Developed by Amro Altayeb.
