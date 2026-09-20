import nodemailer from "nodemailer";
import config from "../../config";
import { getOtpEmailTemplate } from "./Templates/otpEmail.template";
import { getPasswordResetSuccessTemplate } from "./Templates/resetSuccess.template";

// Setup Nodemailer Transporter
const createTransporter = () => {
  if (!config.smtp.user || !config.smtp.pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465, // true for 465, false for other ports
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
};

/**
 * Send 6-Digit OTP Email for Password Reset
 */
export const sendOtpEmail = async (to: string, name: string, otp: string): Promise<boolean> => {
  const html = getOtpEmailTemplate(name, otp);
  const subject = `Your DishDiary Verification Code: ${otp}`;
  const transporter = createTransporter();

  if (!transporter) {
    console.warn(
      `\n=======================================================\n` +
      `[SMTP NOTICE] SMTP credentials not set in .env!\n` +
      `Recipient: ${to} (${name})\n` +
      `>>> 6-Digit OTP Code: [ ${otp} ] <<<\n` +
      `Expires in 10 minutes.\n` +
      `=======================================================\n`
    );
    return true;
  }

  const sender = {
    name: "DishDiary",
    address: config.smtp.user || "no-reply@dishdiary.com",
  };

  try {
    const info = await transporter.sendMail({
      from: sender,
      to,
      subject,
      html,
    });
    console.log(`[Email Service] OTP email sent successfully to ${to} (Message ID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`[Email Service] Failed to send OTP email to ${to}:`, error);
    // Print OTP to console as safety fallback during local testing/dev
    console.log(`[Email Service Fallback] OTP for ${to} is: ${otp}`);
    return false;
  }
};

/**
 * Send Confirmation Email after Successful Password Reset
 */
export const sendPasswordResetSuccessEmail = async (to: string, name: string): Promise<boolean> => {
  const html = getPasswordResetSuccessTemplate(name);
  const subject = "Your DishDiary Password Has Been Reset";
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[Email Service] Password reset confirmation email logged for ${to}`);
    return true;
  }

  const sender = {
    name: "DishDiary",
    address: config.smtp.user || "no-reply@dishdiary.com",
  };

  try {
    await transporter.sendMail({
      from: sender,
      to,
      subject,
      html,
    });
    console.log(`[Email Service] Password reset confirmation email sent to ${to}`);
    return true;
  } catch (error) {
    console.warn(`[Email Service] Failed to send password reset confirmation to ${to}:`, error);
    return false;
  }
};
