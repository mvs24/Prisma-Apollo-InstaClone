import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  text: string;
  html?: string;
  subject: string;
}

class Email {
  constructor(public mailOptions: MailOptions) {}

  createTransporter() {
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_PORT ||
      !process.env.EMAIL_USERNAME ||
      !process.env.EMAIL_PASSWORD
    ) {
      throw new Error("Please define envs");
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendMessage() {
    const transporter = this.createTransporter();

    if (!process.env.EMAIL_FROM) {
      throw new Error("Please specify EMAIL_FROM ENV");
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: this.mailOptions.to,
      subject: this.mailOptions.subject,
      text: this.mailOptions.text,
      html: this.mailOptions.html,
    });
  }
}

export default Email;
