import dotenv from 'dotenv';
import { createUser, removeUser } from '../src/services/auth.service.js';
import connectToDb from '../src/config/db.js';

dotenv.config();

const run = async () => {
    let user;
    try {
        await connectToDb();
        console.log("Connected to DB.");

        const testEmail = "crypto_test_" + Date.now() + "@example.com";
        const password = "password123";
        const name = "Crypto Test User";

        console.log("Creating user to test token generation...");
        user = await createUser({ email: testEmail, password, name });

        console.log("User created:", user._id);
        console.log("Verification Token:", user.verificationToken);

        if (!user.verificationToken) {
            console.error("FAILURE: No verification token generated.");
        } else if (user.verificationToken.length !== 6) {
            console.error(`FAILURE: Token length is ${user.verificationToken.length}, expected 6.`);
        } else {
            console.log("SUCCESS: Token is 6 characters long.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        if (user) {
            await removeUser(user._id);
            console.log("Cleanup done.");
        }
        process.exit(0);
    }
};

run();
