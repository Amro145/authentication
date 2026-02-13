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