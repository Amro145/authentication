import express from 'express';
import {
    checkAuth,
    deleteUser,
    forgotPassword,
    getAllUsers,
    logout,
    resetPassword,
    signIn,
    signUp,
    verifyEmail,
    resendVerification,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import {
    validateRequest,
    signUpSchema,
    signInSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyEmailSchema,
    resendVerificationSchema,
} from '../middleware/validation.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with hashed password and sends a verification email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email: { type: string, format: email, example: "user@example.com" }
 *               password: { type: string, format: password, minLength: 8, example: "Secret123!" }
 *               name: { type: string, example: "John Doe" }
 *     responses:
 *       201:
 *         description: Account created successfully. Returns user data.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       400:
 *         description: Validation error or user already exists.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error during registration.
 */
router.post('/signup', validateRequest(signUpSchema), signUp);

/**
 * @swagger
 * /verify-email:
 *   post:
 *     summary: Verify account email
 *     description: Activates user account using the 6-digit code sent during registration.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verificationToken]
 *             properties:
 *               verificationToken: { type: string, length: 6, example: "123456" }
 *     responses:
 *       200:
 *         description: Email verified successfully. Returns updated user data.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       400:
 *         description: Invalid or expired verification code.
 */
router.post('/verify-email', validateRequest(verifyEmailSchema), verifyEmail);

/**
 * @swagger
 * /resend-verification:
 *   post:
 *     summary: Resend verification code
 *     description: Triggers a new verification email for an unverified account.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: "user@example.com" }
 *     responses:
 *       200:
 *         description: New code sent successfully.
 *       404:
 *         description: User not found.
 */
router.post('/resend-verification', validateRequest(resendVerificationSchema), resendVerification);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: User Login
 *     description: Authenticates user and sets a secure HttpOnly session cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: "user@example.com" }
 *               password: { type: string, format: password, example: "Secret123!" }
 *     responses:
 *       200:
 *         description: Login successful. Returns user data and sets cookie.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       400:
 *         description: Invalid credentials or unverified email.
 *       401:
 *         description: Incorrect email or password.
 */
router.post('/signin', validateRequest(signInSchema), signIn);

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request Password Reset
 *     description: Sends a secure password reset link to the user's email address.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: "user@example.com" }
 *     responses:
 *       200:
 *         description: Reset link sent successfully.
 *       404:
 *         description: No user found with that email address.
 */
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);

/**
 * @swagger
 * /reset-password/{resetCode}:
 *   post:
 *     summary: Complete Password Reset
 *     description: Sets a new password for the user provided a valid, non-expired reset token.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: resetCode
 *         required: true
 *         schema: { type: string, example: "abc123token" }
 *         description: The reset token received by email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string, format: password, minLength: 8, example: "NewSecret123!" }
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Invalid or expired reset token.
 */
router.post('/reset-password/:resetCode', validateRequest(resetPasswordSchema), resetPassword);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User Logout
 *     description: Clears the secure session cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully.
 */
router.post('/logout', logout);

/**
 * @swagger
 * /getall:
 *   get:
 *     summary: List All Users (Admin)
 *     description: Returns a complete list of all registered users.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Success. List of users returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: array, items: { $ref: '#/components/schemas/User' } }
 *       401:
 *         description: Unauthorized. Missing or invalid credentials.
 */
router.get('/getall', getAllUsers);

/**
 * @swagger
 * /delete/{userId}:
 *   delete:
 *     summary: Delete User Account
 *     description: Permanently removes a user from the system by their ID.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, example: "60d21b4667d0d8992e610c85" }
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User ID not found.
 */
router.delete('/delete/:userId', deleteUser);

/**
 * @swagger
 * /check-auth:
 *   get:
 *     summary: Verify Session/User data
 *     description: Checks if the current session is valid and return current user profile.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Session active. Returns user data.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       401:
 *         description: Unauthorized. No valid session found.
 */
router.get('/check-auth', verifyToken, checkAuth);

export default router;