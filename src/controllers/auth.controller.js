import bcrypt from "bcrypt";
import User from "../models/auth.model.js";
import { generateTokenAndSetCookie } from "../../lib/generateTokenAndSetCookie.js";
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
        const verifactionToken = Math.floor(1000000 + Math.random() * 9000000).toString();
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

export const singIn = (req, res) => {
    res.status(200).json({
        message: 'Hello from the singIn controller!',
    });
}
export const logout = (req, res) => {
    res.status(200).json({
        message: 'Hello from the logout controller!',
    });
}
export const forgotPassword = (req, res) => {
    res.status(200).json({
        message: 'Hello from the forgotPassword controller!',
    });
}
export const resetPassword = (req, res) => {
    res.status(200).json({
        message: 'Hello from the resetPassword controller!',
    });
}
export const updatePassword = (req, res) => {
    res.status(200).json({
        message: 'Hello from the updatePassword controller!',
    });
}
