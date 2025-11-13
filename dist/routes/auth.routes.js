"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     description: Create a new user account with student role
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Email already exists or validation error
 *       500:
 *         description: Server error
 */
// User đăng ký bình thường (role mặc định student)
router.post("/register", (req, res) => authController.register(req, res));
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and return access and refresh tokens
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
// Login
router.post("/login", (req, res) => authController.login(req, res));
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token
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
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Server error
 */
// Lấy access token mới
router.post("/refresh", (req, res) => authController.refresh(req, res));
/**
 * @swagger
 * /auth/create-user:
 *   post:
 *     summary: Create user (Admin only)
 *     description: Admin creates a new user with specified role
 *     tags:
 *       - Auth
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               role:
 *                 type: string
 *                 enum: [student, teacher, admin]
 *                 example: teacher
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin only
 *       500:
 *         description: Server error
 */
// Admin tạo user với role tùy ý
router.post("/create-user", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin"]), (req, res) => authController.createUserByAdmin(req, res));
exports.default = router;
