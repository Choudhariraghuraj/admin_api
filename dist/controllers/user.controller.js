"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const user_model_1 = require("../models/user.model");
const getAllUsers = async (_, res) => {
    const users = await user_model_1.User.find().select("-password");
    res.json(users);
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    const user = await user_model_1.User.findById(req.params.id).select("-password");
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    const user = await user_model_1.User.create(req.body);
    res.status(201).json(user);
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    const updated = await user_model_1.User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    await user_model_1.User.findByIdAndDelete(req.params.id);
    res.status(204).send();
};
exports.deleteUser = deleteUser;
