import bcrypt from "bcrypt";
import User from "../models/auth.model.js";
import { generateTokenAndSetCookie } from "../../lib/generateTokenAndSetCookie.js";
import { sendResetPasswordEmail, sendResetPasswordEmailSuccess, sendWelcomeEmail, verificationEmail } from "../../mailtrap/email.js";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

export const signUp = asyncHandler(async (req, res, next) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        throw new ErrorHandler(400, "Please provide all required fields!");
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
        throw new ErrorHandler(400, "User already exists!");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 1 day

    const user = new User({
        email,
        password: hashPassword,
        name,
        verificationToken,
        verificationTokenExpires,
        lastLogin: Date.now(),
        isVerified: false,
    });
    await user.save();
    generateTokenAndSetCookie(res, user._id);
    await verificationEmail(email, verificationToken, name);

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
    const user = await User.findOne({
        verificationToken,
        verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new ErrorHandler(400, "Invalid or expired verification token!");
    }
    if (user.isVerified) {
        throw new ErrorHandler(400, "Email already verified!");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
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
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new ErrorHandler(404, "User not found!");
    }
    res.status(200).json({
        success: true,
        message: "User deleted successfully!",
        data: null,
    });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select("-password");
    res.status(200).json({
        success: true,
        message: "All users fetched successfully!",
        data: users,
    });
});

export const signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ErrorHandler(400, "Please provide all required fields!");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ErrorHandler(400, "Invalid credentials!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ErrorHandler(400, "Invalid credentials!");
    }

    user.lastLogin = Date.now();
    generateTokenAndSetCookie(res, user._id);
    await user.save();

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
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully!",
        data: null,
    });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        throw new ErrorHandler(400, "Please provide an email address!");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ErrorHandler(404, "User not found!");
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    await user.save();

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

    if (!resetCode || !password) {
        throw new ErrorHandler(400, "Please provide all required fields!");
    }
    const user = await User.findOne({
        resetPasswordToken: resetCode,
        resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
        throw new ErrorHandler(400, "Invalid or expired reset token!");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

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
    const user = await User.findById(req.userId);
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