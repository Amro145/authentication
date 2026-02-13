import { generateTokenAndSetCookie } from "../utils/token.js";
import {
    sendResetPasswordEmail,
    sendResetPasswordEmailSuccess,
    sendWelcomeEmail,
    verificationEmail,
} from "../services/email/email.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { COOKIE_NAME } from "../config/constants.js";
import * as authService from "../services/auth.service.js";

export const signUp = asyncHandler(async (req, res, next) => {
    const { email, password, name } = req.body;
    const user = await authService.createUser({ email, password, name });

    generateTokenAndSetCookie(res, user._id);
    await verificationEmail(email, user.verificationToken, name);

    res.status(201).json({
        success: true,
        message: "User created successfully!",
        data: {
            id: user._id,
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
        },
    });
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { verificationToken } = req.body;
    const user = await authService.verifyUserEmail(verificationToken);

    await sendWelcomeEmail(user.email, user.name);

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

    await sendResetPasswordEmail(
        email,
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
        user.name
    );

    res.status(200).json({
        success: true,
        message: "Reset token sent to your email!",
        data: { resetToken },
    });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { password } = req.body;
    const { resetCode } = req.params;

    const user = await authService.resetUserPassword(resetCode, password);

    await sendResetPasswordEmailSuccess(
        user.email,
        `${process.env.CLIENT_URL}/login`,
        user.name
    );

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