import { Router } from "express";
import {
  getAllUsers,
  getCurrentUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile
} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// All routes below this are protected
router.use(protect);

router.get("/", getAllUsers);
router.get("/me", getCurrentUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/me", protect, getProfile);
router.put("/me", protect, upload.single("avatar"), updateProfile);

export default router;
