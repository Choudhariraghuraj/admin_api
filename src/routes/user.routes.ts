import { Router } from "express";
import {
  getAllUsers,
  getCurrentUser,
  updateUser,
  deleteUser
} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// All routes below this are protected
router.use(protect);

router.get("/", getAllUsers);
router.get("/me", getCurrentUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
