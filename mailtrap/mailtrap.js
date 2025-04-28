// const { MailtrapClient } = require("mailtrap");
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
if (!TOKEN) {
    throw new Error("MAILTRAP_API_TOKEN is not defined in .env file");
}

export const client = new MailtrapClient({
    token: TOKEN,
});

export const sender = {
    email: "hello@demomailtrap.co",
    name: "Amro Altayeb",
};


client
    .send({
        from: sender,
        to: recipients,
        subject: "You are awesome!",
        text: "Congrats for sending test email with Mailtrap!",
        category: "Integration Test",
    })
    .then(console.log, console.error);