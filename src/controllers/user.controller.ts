import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import path from "path";

// GET /api/users
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// GET /api/users/me
export const getCurrentUser = async (req: Request, res: Response) => {
  res.json(req.user); // already set by protect middleware
};

// PUT /api/users/:id
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");

  if (!updatedUser) return res.status(404).json({ message: "User not found" });

  res.json(updatedUser);
};

// DELETE /api/users/:id
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted" });
};

export const getProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, currentPassword, newPassword } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    // Password change logic
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid current password" });

      user.password = await bcrypt.hash(newPassword, 10);
    }

    // Avatar upload
    if (req.file) {
      const avatarUrl = `/uploads/${req.file.filename}`;
      user.avatarUrl = avatarUrl;
    }

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
