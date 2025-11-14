import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const userController = new UserController();

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
router.get("/me", authenticate, (req, res) =>
  userController.getProfile(req, res)
);
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
router.put("/me", authenticate, (req, res) =>
  userController.updateProfile(req, res) // validate không cho sửa role
);

/**
 * @swagger
 * /users/me/sessions:
 *   get:
 *     summary: Get all active sessions for current user
 *     description: Retrieve list of active login sessions with device information
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceId:
 *                         type: string
 *                       deviceName:
 *                         type: string
 *                       ipAddress:
 *                         type: string
 *                       issuedAt:
 *                         type: string
 *                         format: date-time
 *                       expiresAt:
 *                         type: string
 *                         format: date-time
 *                       lastUsedAt:
 *                         type: string
 *                         format: date-time
 *                 count:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/me/sessions", authenticate, (req, res) =>
  userController.getActiveSessions(req, res)
);

/**
 * @swagger
 * /users/me/sessions/logout:
 *   post:
 *     summary: Logout from a specific device
 *     description: Revoke refresh token for a specific device by deviceId
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
 *               deviceId:
 *                 type: string
 *             required:
 *               - deviceId
 *     responses:
 *       200:
 *         description: Device logged out successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/me/sessions/logout", authenticate, (req, res) =>
  userController.logoutDevice(req, res)
);

/**
 * @swagger
 * /users/me/sessions/logout-all:
 *   post:
 *     summary: Logout from all devices
 *     description: Revoke all refresh tokens and logout from all active sessions
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Logged out from all devices successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/me/sessions/logout-all", authenticate, (req, res) =>
  userController.logoutAll(req, res)
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
router.get("/", authenticate, authorize(["admin"]), (req, res) =>
  userController.getAllUsers(req, res)
);
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
router.get("/:id", authenticate, authorize(["admin"]), (req, res) =>
  userController.getUserById(req, res)
);
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
router.put("/:id", authenticate, authorize(["admin"]), (req, res) =>
  userController.updateUser(req, res)
);
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
router.delete("/:id", authenticate, authorize(["admin"]), (req, res) =>
  userController.deleteUser(req, res)
);

export default router;
