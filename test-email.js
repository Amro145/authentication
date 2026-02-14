import dotenv from 'dotenv';
dotenv.config();
import { verificationEmail, sendResetPasswordEmail } from './src/services/email/email.service.js';

const testEmail = "nasor.work@gmail.com"; // Assuming this is the user's email based on the directory name /home/nasor/

async function runTest() {
    console.log("Testing email delivery to:", testEmail);
    try {
        console.log("Sending verification email...");
        await verificationEmail(testEmail, "123456", "Nasor Test");
        console.log("Verification email test successful!");

        console.log("Sending reset password email...");
        await sendResetPasswordEmail(testEmail, "https://example.com/reset", "Nasor Test");
        console.log("Reset password email test successful!");
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

runTest();
