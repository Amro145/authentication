import express from 'express';
import { deleteUser, forgotPassword, getAllUsers, logout, resetPassword, singIn, singUp,  updatePassword } from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/signup', singUp);
router.delete('/delete/:userId', deleteUser);
router.get('/getall', getAllUsers);
router.post('/signin', singIn);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/update-password', updatePassword);

export default router;