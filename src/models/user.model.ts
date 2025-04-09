import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface UserDocument extends IUser, Document {}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" }
  },
  { timestamps: true }
);

export const User = mongoose.model<UserDocument>("User", userSchema);
