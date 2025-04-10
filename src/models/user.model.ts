import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  avatarUrl?: string; // ✅ Add this optional field
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatarUrl: { type: String }, // ✅ Optional avatar URL
  },
  { timestamps: true }
);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
