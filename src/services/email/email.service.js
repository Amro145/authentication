import { resend, sender } from "./resend.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./email.templates.js";

export const verificationEmail = async (email, code, name) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `${sender.name} <${sender.email}>`,
            to: [email],
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", code).replace("{userName}", name),
        });

        if (error) throw error;
        console.log("Verification email sent successfully:", data);
    } catch (error) {
        console.error("Error sending verification email:", error.message || error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `${sender.name} <${sender.email}>`,
            to: [email],
            subject: "Welcome to our service!",
            html: `<h1>Hello ${name},</h1><p>Welcome to our service! We are glad to have you on board.</p>`,
        });

        if (error) throw error;
        console.log("Welcome email sent successfully:", data);
    } catch (error) {
        console.error("Error sending welcome email:", error.message || error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

export const sendResetPasswordEmail = async (email, resetURL, name) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `${sender.name} <${sender.email}>`,
            to: [email],
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL).replace("{userName}", name),
        });

        if (error) throw error;
        console.log("Reset password email sent successfully:", data);
    } catch (error) {
        console.error("Error sending reset password email:", error.message || error);
        console.error("Full Error Object:", JSON.stringify(error, null, 2));
        throw new Error(`Error sending reset password email: ${error.message}`);
    }
};

export const sendResetPasswordEmailSuccess = async (email, loginURL, name) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `${sender.name} <${sender.email}>`,
            to: [email],
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{loginURL}", loginURL).replace("{userName}", name),
        });

        if (error) throw error;
        console.log("Password reset success email sent successfully:", data);
    } catch (error) {
        console.error("Error sending password reset success email:", error.message || error);
        throw new Error(`Error sending password reset success email: ${error.message}`);
    }
};