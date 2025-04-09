"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getCurrentUser = exports.getAllUsers = void 0;
const user_model_1 = require("../models/user.model");
// GET /api/users
const getAllUsers = async (req, res) => {
    const users = await user_model_1.User.find().select("-password");
    res.json(users);
};
exports.getAllUsers = getAllUsers;
// GET /api/users/me
const getCurrentUser = async (req, res) => {
    res.json(req.user); // already set by protect middleware
};
exports.getCurrentUser = getCurrentUser;
// PUT /api/users/:id
const updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const updatedUser = await user_model_1.User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!updatedUser)
        return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
};
exports.updateUser = updateUser;
// DELETE /api/users/:id
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const deleted = await user_model_1.User.findByIdAndDelete(id);
    if (!deleted)
        return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
};
exports.deleteUser = deleteUser;
