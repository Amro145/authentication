import bcrypt from "bcrypt";
import User from "../models/auth.model.js";
import { generateTokenAndSetCookie } from "../../lib/generateTokenAndSetCookie.js";
import { sendResetPasswordEmail, sendResetPasswordEmailSuccess, sendWelcomeEmail, verificationEmail } from "../../mailtrap/email.js";
import crypto from "crypto";
export const singUp = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            return res.status(400).json({
                message: 'Please provide all required fields!',
            });
        }
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({
                message: 'User already exists!',
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const verifactionToken = Math.floor(10000000 + Math.random() * 9000000).toString();
        const verifactionTokenExpires = Date.now() + 24 * 60 * 60 * 1000;  // 1 day
        const user = new User({
            email,
            password: hashPassword,
            name,
            verifactionToken,
            verifactionTokenExpires,
            lastLogin: Date.now(),
            isVerified: false,
        })
        await user.save();
        generateTokenAndSetCookie(res, user._id);
        await verificationEmail(email, verifactionToken, name);
        res.status(201).json({
            message: 'User created successfully!',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                verifactionToken: user.verifactionToken,
                verifactionTokenExpires: user.verifactionTokenExpires,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error in the singUp controller!',
            error: error.message,
        });

    }
}

export const verifyEmail = async (req, res) => {
    const { verifactionToken } = req.body;
    try {
        const user = await User.findOne({ verifactionToken, verifactionTokenExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired verification token!',
            });
        }
        if (user.isVerfied) {
            return res.status(400).json({
                message: 'Email already verified!',
            });
        }
        user.isVerfied = true;
        user.verifactionToken = undefined;
        user.verifactionTokenExpires = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        return res.status(200).json({
            message: 'Email verified successfully!',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error in the verifyEmail controller!',
            error: error.message,
        });
    }
}

export const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found!',
            });
        }
        res.status(200).json({
            message: 'User deleted successfully!',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error in the deleteUser controller!',
            error: error.message,
        });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            message: 'All users fetched successfully!',
            users,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error in the getAllUsers controller!',
            error: error.message,
        });
    }
}

export const singIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide all required fields!',
            });
        }
        const user = await User.findOne({ email }); // Fix: Use findOne instead of find
        if (!user) {
            return res.status(400).json({
                message: 'User not found!',
            });
        }
        if (!user.password) {
            return res.status(400).json({
                message: 'User password is missing!',
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials!',
            });
        }
        if (!user.isVerfied) {
            return res.status(400).json({
                message: 'Email not verified!',
            });
        }
        user.lastLogin = Date.now();
        generateTokenAndSetCookie(res, user._id);
        await user.save();
        res.status(200).json({
            message: 'User logged in successfully!',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                lastLogin: user.lastLogin,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error in the singIn controller!',
            error: error.message,
        });
    }
};
export const logout = (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({
            message: 'Logged out successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error in the logout controller!',
            error: error.message,
        });
    }
}
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: 'Please provide an email address!',
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'User not found!',
            });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hou
        await user.save();
        // Send the reset token to the user's email
        await sendResetPasswordEmail(email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`, user.name);

        res.status(200).json({
            message: 'Reset token sent to your email!',
            resetToken,
            user
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in the forgotPassword controller!',
            error: error.message,
        });
    }
}
export const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { resetCode } = req.params;

    try {
        if (!resetCode || !password) {
            return res.status(400).json({
                message: 'Please provide all required fields!',
            });
        }
        const user = await User.findOne({
            resetPasswordToken: resetCode,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset token!',
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        await sendResetPasswordEmailSuccess(user.email, `${process.env.CLIENT_URL}/login`, user.name);
        res.status(200).json({
            message: 'Password reset successfully!',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error in the resetPassword controller!',
            error: error.message,
        });

    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized! No user found.',
            });
        }
        res.status(200).json({
            message: 'User authenticated successfully!',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                lastLogin: user.lastLogin,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error in the checkAuth controller!',
            error: error.message,
        });
    }
}