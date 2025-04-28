import { client, sender } from "./mailtrap.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./mailtrap.tamplate.js";

export const verificationEmail = async (email, code, name) => {
    const recipients = [{ email }]
    try {
        const response = await client
            .send({
                from: sender,
                to: recipients,
                subject: "You are awesome!",
                html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", code).replace("{userName}", name),
                category: "Email Verification",
            })
        console.log("Email sent successfully:", response);

    } catch (error) {
        console.error("Error sending email:", error);
    }
}
