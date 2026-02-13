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
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import {
    validateRequest,
    signUpSchema,
    signInSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyEmailSchema,
} from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/signup', validateRequest(signUpSchema), signUp);
router.post('/verify-email', validateRequest(verifyEmailSchema), verifyEmail);
router.post('/signin', validateRequest(signInSchema), signIn);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:resetCode', validateRequest(resetPasswordSchema), resetPassword);

router.post('/logout', logout);
router.get('/getall', getAllUsers);
router.delete('/delete/:userId', deleteUser);
router.get('/check-auth', verifyToken, checkAuth);

export default router;