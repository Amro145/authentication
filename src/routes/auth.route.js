import express from 'express';
import { checkAuth, deleteUser, forgotPassword, getAllUsers, logout, resetPassword, singIn, singUp,  verifyEmail } from '../controllers/auth.controller.js';
import { verifyToken } from '../../middleWare/verifyToken.js';

const router = express.Router();
router.post('/signup', singUp);
router.post('/verify-email', verifyEmail);
router.delete('/delete/:userId', deleteUser);
router.get('/getall', getAllUsers);
router.post('/signin', singIn);
router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetCode', resetPassword);
router.get('/check-auth', verifyToken, checkAuth);

export default router;