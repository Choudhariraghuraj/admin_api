import bcrypt from "bcrypt";
import mongoose, { Document, Schema } from "mongoose";

// Define the User schema interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>; // <-- added
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], required: true },
  avatar: { type: String, default: "" },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

// Hash the password before saving to the database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
