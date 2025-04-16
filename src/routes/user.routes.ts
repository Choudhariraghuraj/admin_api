import express from "express";
import upload from "../middlewares/upload.middleware";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  getMe,
  updateMe,
} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Public Routes
router.get("/", getUsers); // Get all users (excluding password)
router.get("/:id", getUser); // Get a specific user by ID (excluding password)
router.post("/", upload.single("avatar"), createUser); // Create a new user

// Protected Routes (requires authentication)
router.get("/me", protect, getMe); // Get logged-in user details
router.put("/me", protect, upload.single("avatar"), updateMe); // Update logged-in user's profile
router.put("/:id", upload.single("avatar"), updateUser); // Update user by ID
router.delete("/:id", deleteUser); // Delete user by ID

export default router;
