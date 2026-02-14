import { generateTokenAndSetCookie } from "../utils/token.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import {
    sendResetPasswordEmail,
    sendResetPasswordEmailSuccess,
    sendWelcomeEmail,
    verificationEmail,
} from "../services/email/email.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { COOKIE_NAME } from "../config/constants.js";
import * as authService from "../services/auth.service.js";

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export const signUp = asyncHandler(async (req, res, next) => {
    const { email, password, name } = req.body;
    const user = await authService.createUser({ email, password, name });

    generateTokenAndSetCookie(res, user._id);

    let emailSent = true;
    try {
        await verificationEmail(email, user.verificationToken, name);
    } catch (error) {
        console.error("Signup Email Error:", error.message);
        emailSent = false;
    }

    res.status(201).json({
        success: true,
        message: emailSent
            ? "User created successfully! Please check your email for the verification code."
            : "User created, but email failed to send. Please try checking your profile later to resend.",
        data: {
            id: user._id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
            emailSent
        },
    });
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { verificationToken } = req.body;
    const user = await authService.verifyUserEmail(verificationToken);

    try {
        await sendWelcomeEmail(user.email, user.name);
    } catch (error) {
        console.error("Welcome Email Error:", error.message);
    }

    res.status(200).json({
        success: true,
        message: "Email verified successfully!",
        data: {
            id: user._id,
            email: user.email,
            name: user.name,
            isVerified: true,
        },
    });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    await authService.removeUser(userId);
    res.status(200).json({
        success: true,
        message: "User deleted successfully!",
        data: null,
    });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await authService.fetchAllUsers();
    res.status(200).json({
        success: true,
        message: "All users fetched successfully!",
        data: users,
    });
});

export const signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await authService.authenticateUser(email, password);

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
        success: true,
        message: "User logged in successfully!",
        data: {
            id: user._id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
        },
    });
});

export const logout = asyncHandler(async (req, res, next) => {
    res.clearCookie(COOKIE_NAME);
    res.status(200).json({
        success: true,
        message: "Logged out successfully!",
        data: null,
    });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const { user, resetToken } = await authService.generateResetToken(email);

    let emailSent = true;
    try {
        await sendResetPasswordEmail(
            email,
            `${CLIENT_URL}/reset-password/${resetToken}`,
            user.name
        );
    } catch (error) {
        console.error("Forgot Password Email Error:", error.message);
        emailSent = false;
    }

    if (!emailSent) {
        return next(new ErrorHandler(500, "Failed to send password reset email. Please try again later."));
    }

    res.status(200).json({
        success: true,
        message: "Reset token sent to your email!",
        data: null,
    });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body;
    const { resetCode } = req.params;

    console.log(`[resetPassword] Attempting reset. Token: ${resetCode}, Password Length: ${password?.length}`);

    const user = await authService.resetUserPassword(resetCode, password);

    try {
        await sendResetPasswordEmailSuccess(
            user.email,
            `${CLIENT_URL}/login`,
            user.name
        );
    } catch (error) {
        console.error("Reset Password Success Email Error:", error.message);
    }

    res.status(200).json({
        success: true,
        message: "Password reset successfully!",
        data: null,
    });
});

export const checkAuth = asyncHandler(async (req, res, next) => {
    const user = await authService.findUserById(req.userId);
    if (!user) {
        throw new ErrorHandler(401, "Unauthorized! No user found.");
    }
    res.status(200).json({
        success: true,
        message: "User authenticated successfully!",
        data: {
            id: user._id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
        },
    });
});

export const resendVerification = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const { user, verificationToken } = await authService.resendVerificationToken(email);

    let emailSent = true;
    try {
        await verificationEmail(email, verificationToken, user.name);
    } catch (error) {
        console.error("Resend Verification Email Error:", error.message);
        emailSent = false;
    }

    res.status(200).json({
        success: true,
        message: emailSent
            ? "A new verification code has been sent to your email."
            : "Verification code regenerated, but email failed to send. Please try again later.",
        data: { emailSent }
    });
});