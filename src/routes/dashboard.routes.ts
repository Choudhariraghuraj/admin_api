import express from "express";
import { getDashboardOverview } from "../controllers/dashboard.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/overview", protect, getDashboardOverview);

export default router;
