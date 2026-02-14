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
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email: { type: string }
 *               password: { type: string, minLength: 6 }
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request or user already exists
 */
router.post('/signup', validateRequest(signUpSchema), signUp);

/**
 * @swagger
 * /verify-email:
 *   post:
 *     summary: Verify user email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verificationToken]
 *             properties:
 *               verificationToken: { type: string }
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/verify-email', validateRequest(verifyEmailSchema), verifyEmail);

/**
 * @swagger
 * /resend-verification:
 *   post:
 *     summary: Resend verification email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Bad request or user already verified
 *       404:
 *         description: User not found
 */
router.post('/resend-verification', validateRequest(resendVerificationSchema), resendVerification);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post('/signin', validateRequest(signInSchema), signIn);

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Reset token sent to email
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);

/**
 * @swagger
 * /reset-password/{resetCode}:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: resetCode
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password/:resetCode', validateRequest(resetPasswordSchema), resetPassword);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', logout);

/**
 * @swagger
 * /getall:
 *   get:
 *     summary: Get all users (Admin)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of users fetched
 */
router.get('/getall', getAllUsers);

/**
 * @swagger
 * /delete/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/delete/:userId', deleteUser);

/**
 * @swagger
 * /check-auth:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/check-auth', verifyToken, checkAuth);

export default router;