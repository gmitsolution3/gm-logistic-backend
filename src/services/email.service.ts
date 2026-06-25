import { transporter } from "../config/mail";

type TSendEmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const sendEmail = async (
  payload: TSendEmailPayload,
) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,

    to: payload.to,

    subject: payload.subject,

    html: payload.html,
  });
};

export const EmailService = {
  sendEmail,
};