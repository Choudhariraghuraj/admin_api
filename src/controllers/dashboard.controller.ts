import { Request, Response } from "express";
import User from "../models/user.model";

export const getDashboardOverview = async (_req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const usersToday = await User.countDocuments({
      createdAt: { $gte: today },
    });

    // User stats for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Including today

    const stats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Fill missing dates
    const userStats: { date: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split("T")[0];
      const stat = stats.find((s) => s._id === dateStr);
      userStats.push({ date: dateStr, count: stat ? stat.count : 0 });
    }

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email avatar createdAt");

    res.status(200).json({
      totalUsers,
      totalAdmins,
      usersToday,
      userStats,
      recentUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};
