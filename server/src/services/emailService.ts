import Mustache from "mustache";
import fs from "node:fs/promises"; // promise version of the file system module
import path from "node:path";
import nodemailer from "nodemailer";
import { IUser } from "../models/User";

// The transporter is the "connection" to the SMTP server. Created once and reused.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT), // env values are strings, so convert
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465 (SSL), false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendSubmissionEmail = async (data: IUser): Promise<void> => {
  //   console.log("SMTP pass length:", process.env.SMTP_PASS?.length);
  // 1) Read the HTML template from disk (process.cwd() = the server/ folder you run from)
  const templatePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "submissionEmail.html",
  );
  const template = await fs.readFile(templatePath, "utf-8");

  // 2) Fill the placeholders: Mustache.render(template, valuesObject)
  const html = Mustache.render(template, {
    name: data.name,
    email: data.email,
    age: data.age,
    address: data.address,
    phone: data.phone,
    year: new Date().getFullYear(),
  });

  // 3) Send it
  await transporter.sendMail({
    from: process.env.MAIL_FROM, // the sender shown in the inbox
    to: data.email, // the address the user typed in the form
    subject: "We received your registration",
    html, // the rendered HTML body
    text: `Thanks for registering, ${data.name}!`, // plain-text fallback for clients that block HTML
  });
};
