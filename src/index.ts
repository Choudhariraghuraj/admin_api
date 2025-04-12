import "./types/express"; // extend req.user typing
import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();
// ✅ Use the port from Render
const PORT = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://admin-ui-wheat.vercel.app"
  ],
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log("✅ MongoDB connected");
  server.listen(PORT, () => console.log("🚀 Server running on port 5001"));
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);
});
