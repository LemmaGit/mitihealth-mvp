import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
// const SMTP_FROM = process.env.SMTP_FROM || "no-reply@mitihealth.local";
const SMTP_FROM = "no-reply@mitihealth.local";

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
  return transporter;
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  const t = getTransporter();
  if (!t) return;
  await t.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    text,
  });
};
