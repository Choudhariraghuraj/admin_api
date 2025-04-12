import express from "express";
import upload from "../middlewares/upload.middleware";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", upload.single("avatar"), createUser);
router.put("/:id", upload.single("avatar"), updateUser);
router.delete("/:id", deleteUser);

export default router;
