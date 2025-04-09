"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// All routes below this are protected
router.use(auth_middleware_1.protect);
router.get("/", user_controller_1.getAllUsers);
router.get("/me", user_controller_1.getCurrentUser);
router.put("/:id", user_controller_1.updateUser);
router.delete("/:id", user_controller_1.deleteUser);
exports.default = router;
