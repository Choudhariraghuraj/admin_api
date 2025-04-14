import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model";

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

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 mins
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  // TODO: Send `resetLink` to user via email (log for now)
  console.log("Reset link:", resetLink);

  res.json({ message: "Password reset link sent to your email" });
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
