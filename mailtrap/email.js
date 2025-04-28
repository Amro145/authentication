import { client, sender } from "./mailtrap";

export const sendEmail = async (email, code) => {
    const recipients = [{ email }]
    try {
        client
            .send({
                from: sender,
                to: recipients,
                subject: "You are awesome!",
                text: "Congrats for sending test email with Mailtrap!",
                category: "Integration Test",
            })
            .then(console.log, console.error);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
