
import nodemailer from "nodemailer";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });

const createTransporter = () => {
  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;

  if (!user || !password) {
    throw new Error("Gmail SMTP credentials are missing.");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user,
      pass: password.replace(/\s/g, ""),
    },
  });
};

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
) {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"BookHaven" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to send email.",
    };
  }
}

export async function sendVerificationEmail(
  to: string,
  code: string,
  name?: string
) {
  const safeName = escapeHtml(name || "User");

  const subject = "Verify your BookHaven account";
  const text = `Hello ${name || "User"}, your BookHaven verification code is ${code}. It expires in 10 minutes.`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to BookHaven!</h2>
      <p>Hello ${safeName},</p>
      <p>Use the following OTP to verify your email address:</p>
      <h1 style="letter-spacing: 8px; color: #2563eb;">
        ${escapeHtml(code)}
      </h1>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not create this account, you can ignore this email.</p>
      <p>Regards,<br/>BookHaven Team</p>
    </div>
  `;

  return sendEmail(to, subject, html, text);
}

export async function sendPasswordResetEmail(
  to: string,
  code: string,
  name?: string
) {
  const safeName = escapeHtml(name || "User");

  const subject = "Reset your BookHaven password";
  const text = `Hello ${name || "User"}, your BookHaven password reset code is ${code}. It expires in 10 minutes.`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>Hello ${safeName},</p>
      <p>Use the following OTP to reset your password:</p>
      <h1 style="letter-spacing: 8px; color: #2563eb;">
        ${escapeHtml(code)}
      </h1>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request a password reset, you can ignore this email.</p>
      <p>Regards,<br/>BookHaven Team</p>
    </div>
  `;

  return sendEmail(to, subject, html, text);
}
