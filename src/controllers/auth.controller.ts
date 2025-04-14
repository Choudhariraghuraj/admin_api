import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model";
import { sendEmail } from "../utils/mailer";

// Helper to generate JWT
export const generateToken = (id: string, remember = false) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: remember ? "30d" : "1d", // Longer if "remember me" is checked
  });
};

// @route   POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role = "user", avatar } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const newUser = await User.create({
    name,
    email,
    password,
    role,
    avatar
  });

  const token = generateToken(newUser._id.toString());

  res.status(201).json({
    token,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar
    }
  });
};

// @route   POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  const { email, password, remember } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = generateToken(user._id.toString(), remember);

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const emailBody = `
  <div style="background-color: #1e1e2f; padding: 30px; border-radius: 10px; color: #ffffff; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <h2 style="color: #00bcd4; text-align: center;">🔐 Password Reset Request</h2>
    <p style="font-size: 16px;">
      Hi ${user.name || "there"},
    </p>
    <p style="font-size: 16px;">
      We received a request to reset your password. Click the button below to proceed. This link is valid for 1 hour.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" target="_blank"
         style="background-color: #00bcd4; color: #1e1e2f; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px;">
         Reset Password
      </a>
    </div>
    <p style="font-size: 14px; color: #aaa;">
      If you didn’t request this, you can safely ignore this email.
    </p>
    <hr style="border-color: #333; margin-top: 40px;" />
    <p style="font-size: 12px; color: #666; text-align: center;">
      &copy; ${new Date().getFullYear()} MyApp. All rights reserved.
    </p>
  </div>
`;


  await sendEmail(user.email, "Reset your password", emailBody);

  res.json({ message: "Reset email sent successfully" });
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password has been reset successfully" });
};
