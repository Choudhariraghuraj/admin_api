import { Request, Response } from "express";
import User from "../models/user.model";
import fs from "fs";
import path from "path";

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.status(200).json({ users });
};

export const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const avatar = req.file?.filename;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already in use" });

  const user = await User.create({ name, email, password, role, avatar });
  res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.role = role ?? user.role;

  if (req.file?.filename) {
    // Delete old avatar if exists
    if (user.avatar) {
      const oldPath = path.join(__dirname, "../../uploads", user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    user.avatar = req.file.filename;
  }

  await user.save();
  res.status(200).json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.avatar) {
    const avatarPath = path.join(__dirname, "../../uploads", user.avatar);
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
  }

  await user.deleteOne();
  res.status(200).json({ message: "User deleted" });
};

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check for email change
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Update other fields
    user.name = name ?? user.name;

    // Handle password change
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
      user.password = newPassword;
    }

    // Handle avatar update
    if (req.file?.filename) {
      // Delete old avatar if exists
      if (user.avatar) {
        const oldPath = path.join(__dirname, "../../uploads", user.avatar);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      user.avatar = req.file.filename;
    }

    // Save the updated user
    await user.save();
    res.status(200).json(user); // Return the updated user data
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};
