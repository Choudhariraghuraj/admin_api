"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
// Helper to generate JWT
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};
// @route   POST /api/auth/register
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const existing = await user_model_1.User.findOne({ email });
    if (existing)
        return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = await user_model_1.User.create({
        name,
        email,
        password: hashedPassword,
        role
    });
    const token = generateToken(newUser._id.toString());
    res.status(201).json({
        token,
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }
    });
};
exports.register = register;
// @route   POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({ message: "Invalid password" });
    const token = generateToken(user._id.toString());
    res.json({
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
exports.login = login;
