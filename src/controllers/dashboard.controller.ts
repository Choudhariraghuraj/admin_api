import { Request, Response } from "express";
import User from "../models/user.model";

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user; // Injected from auth middleware
    if (!currentUser) return res.status(401).json({ message: "Unauthorized" });

    // If admin, return global stats
    if (currentUser.role === "admin") {
      const totalUsers = await User.countDocuments();
      const adminUsers = await User.countDocuments({ role: "admin" });
      const normalUsers = await User.countDocuments({ role: "user" });

      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("-password");

      return res.status(200).json({
        totalUsers,
        adminUsers,
        normalUsers,
        recentUsers,
        currentUser,
      });
    }

    // If normal user, return limited stats
    const self = await User.findById(currentUser._id).select("-password");
    return res.status(200).json({
      totalUsers: 1,
      adminUsers: 0,
      normalUsers: 1,
      recentUsers: [self],
      currentUser: self,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
