import bcrypt from "bcrypt";
import User from "../models/auth.model.js";
import crypto from "crypto";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { RESET_TOKEN_EXPIRY, VERIFICATION_TOKEN_EXPIRY } from "../config/constants.js";

export const createUser = async ({ email, password, name }) => {
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
        throw new ErrorHandler(400, "User already exists!");
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomInt(100000, 999999).toString();
    const verificationTokenExpires = Date.now() + VERIFICATION_TOKEN_EXPIRY;

    const user = new User({
        email,
        password: hashPassword,
        name,
        verificationToken,
        verificationTokenExpires,
        lastLogin: Date.now(),
        isVerified: false,
    });

    return await user.save();
};

export const verifyUserEmail = async (verificationToken) => {
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
    return await user.save();
};

export const authenticateUser = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ErrorHandler(400, "Invalid credentials!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ErrorHandler(400, "Invalid credentials!");
    }

    user.lastLogin = Date.now();
    return await user.save();
};

export const findUserById = async (userId) => {
    return await User.findById(userId);
};

export const fetchAllUsers = async () => {
    return await User.find().select("-password");
};

export const removeUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new ErrorHandler(404, "User not found!");
    }
    return user;
};

export const generateResetToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new ErrorHandler(404, "User not found!");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + RESET_TOKEN_EXPIRY;
    await user.save();
    return { user, resetToken };
};

export const resetUserPassword = async (resetCode, newPassword) => {
    // 1. Find user by token only
    const user = await User.findOne({
        resetPasswordToken: resetCode,
    });

    if (!user) {
        throw new ErrorHandler(400, "Invalid reset token! User not found.");
    }

    // 2. Check expiration
    if (user.resetPasswordExpires < Date.now()) {
        throw new ErrorHandler(400, "Reset token has expired! Please request a new one.");
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.isVerified = true; // Auto-verify email on successful password reset
    return await user.save();
};
