import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import config from "../../../config";
import { AppError } from "../../error/AppError";
import { prisma } from "../../lib/prisma";
import {
  IChangePassword,
  IForgotPassword,
  ILoginUser,
  IRegisterUser,
  IResetPassword,
  IVerifyOtp,
} from "./auth.interface";
import {
  sendOtpEmail,
  sendPasswordResetSuccessEmail,
} from "../../utils/email.service";

const registerUser = async (payload: IRegisterUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isUserExist) {
    throw new AppError("User with this email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.password_salt)
  );

  const newUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return newUser;
};

const loginUser = async (payload: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  if (user.status === "blocked" || user.status === "inactive") {
    throw new AppError(`User account is ${user.status}`, 403);
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError("Invalid credentials", 401);
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt.secret as Secret, {
    expiresIn: config.jwt.expire_in as SignOptions["expiresIn"],
  });

  const { password, ...result } = user;

  return {
    accessToken,
    user: result,
  };
};

const changePassword = async (
  userId: string,
  payload: IChangePassword
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError("Old password does not match", 400);
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.password_salt)
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newHashedPassword,
    },
  });

  return { message: "Password updated successfully" };
};

const refreshToken = async (token: string) => {
  let decoded: JwtPayload & { id: string; email: string; role: string };
  try {
    decoded = jwt.verify(
      token,
      config.jwt.secret as Secret
    ) as JwtPayload & { id: string; email: string; role: string };
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.status === "blocked" || user.status === "inactive") {
    throw new AppError(`User account is ${user.status}`, 403);
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt.secret as Secret, {
    expiresIn: config.jwt.expire_in as SignOptions["expiresIn"],
  });

  return { accessToken };
};

const forgotPassword = async (payload: IForgotPassword) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError("No account found with this email address", 404);
  }

  if (user.status === "blocked" || user.status === "inactive") {
    throw new AppError(`Account is ${user.status}. Please contact support.`, 403);
  }

  // Generate 6-Digit random OTP code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Valid for 10 minutes
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otpCode: otp,
      otpExpires,
    },
  });

  // Send HTML Email via Nodemailer SMTP
  await sendOtpEmail(user.email, user.name, otp);

  return {
    message: "A 6-digit verification code has been sent to your email.",
  };
};

const verifyOtp = async (payload: IVerifyOtp) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError("No account found with this email address", 404);
  }

  if (!user.otpCode || !user.otpExpires) {
    throw new AppError("No active OTP request found. Please request a new code.", 400);
  }

  const isExpired = new Date() > new Date(user.otpExpires);
  if (isExpired) {
    throw new AppError("The verification code has expired. Please request a new code.", 400);
  }

  if (user.otpCode !== payload.otp.trim()) {
    throw new AppError("Invalid verification code. Please check your email and try again.", 400);
  }

  return {
    message: "Verification code verified successfully. You may now reset your password.",
  };
};

const resetPassword = async (payload: IResetPassword) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new AppError("No account found with this email address", 404);
  }

  if (!user.otpCode || !user.otpExpires) {
    throw new AppError("Invalid or expired password reset session.", 400);
  }

  const isExpired = new Date() > new Date(user.otpExpires);
  if (isExpired) {
    throw new AppError("The verification code has expired. Please request a new one.", 400);
  }

  if (user.otpCode !== payload.otp.trim()) {
    throw new AppError("Invalid verification code.", 400);
  }

  // Hash new password using bcrypt
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.password_salt)
  );

  // Update password and clear OTP
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: newHashedPassword,
      otpCode: null,
      otpExpires: null,
    },
  });

  // Send Confirmation Email
  sendPasswordResetSuccessEmail(user.email, user.name).catch((err) =>
    console.warn("[Auth] Failed to send reset success email:", err)
  );

  return {
    message: "Password reset successful! You can now sign in with your new password.",
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  verifyOtp,
  resetPassword,
};

