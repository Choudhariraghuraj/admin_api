import { Request, Response } from "express";
import { User } from "../models/user.model";

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
