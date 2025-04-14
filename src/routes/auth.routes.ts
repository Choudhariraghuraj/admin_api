import { Router } from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/auth.controller";
import upload from "../middlewares/upload.middleware";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
