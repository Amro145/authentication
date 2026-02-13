import Joi from 'joi';
import { ErrorHandler } from '../utils/ErrorHandler.js';

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        });

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return next(new ErrorHandler(400, errorMessage));
        }

        next();
    };
};

export const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).required(),
});

export const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string().min(8).required(),
});

export const verifyEmailSchema = Joi.object({
    verificationToken: Joi.string().length(6).required(),
});
