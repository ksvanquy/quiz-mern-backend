"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Rate limiters for auth endpoints to mitigate brute-force attacks
const registerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 register requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 login attempts per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
const refreshLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
});
// User đăng ký bình thường (role mặc định student)
router.post("/register", registerLimiter, (req, res) => authController.register(req, res));
router.post("/login", loginLimiter, (req, res) => authController.login(req, res));
router.post("/refresh", refreshLimiter, (req, res) => authController.refresh(req, res));
// Logout: revokes a refresh token (expected in request body)
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout and revoke refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to revoke
 *     responses:
 *       200:
 *         description: Token revoked successfully
 *       400:
 *         description: Bad request (missing token or validation failed)
 */
router.post("/logout", (req, res) => authController.logout(req, res));
// Admin tạo user với role tùy ý
router.post("/create-user", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin"]), (req, res) => authController.createUserByAdmin(req, res));
exports.default = router;
