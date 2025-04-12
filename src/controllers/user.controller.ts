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
    if (user.avatar) {
      fs.unlinkSync(path.join(__dirname, `../../uploads/${user.avatar}`));
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
    fs.unlinkSync(path.join(__dirname, `../../uploads/${user.avatar}`));
  }

  await user.deleteOne();
  res.status(200).json({ message: "User deleted" });
};
