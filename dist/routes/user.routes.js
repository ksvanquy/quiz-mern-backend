"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the authenticated user's profile
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// User routes (profile) nên đặt **trước** /:id
router.get("/me", auth_middleware_1.authenticate, (req, res) => userController.getProfile(req, res));
/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user profile
 *     description: Update the authenticated user's profile (cannot change role)
 *     tags:
 *       - Users
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
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/me", auth_middleware_1.authenticate, (req, res) => userController.updateProfile(req, res) // validate không cho sửa role
);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve list of all users
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin only
 *       500:
 *         description: Server error
 */
// Admin routes
router.get("/", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin"]), (req, res) => userController.getAllUsers(req, res));
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin only
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin"]), (req, res) => userController.getUserById(req, res));
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user (Admin only)
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, teacher, admin]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin only
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin"]), (req, res) => userController.updateUser(req, res));
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin only
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin"]), (req, res) => userController.deleteUser(req, res));
exports.default = router;
