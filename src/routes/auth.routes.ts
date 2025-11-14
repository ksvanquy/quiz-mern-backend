import { Router } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const authController = new AuthController();

// Rate limiters for auth endpoints to mitigate brute-force attacks
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 register requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// User đăng ký bình thường (role mặc định student)
router.post("/register", registerLimiter, (req, res) =>
  authController.register(req, res)
);
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
router.post(
  "/create-user",
  authenticate,
  authorize(["admin"]),
  (req, res) => authController.createUserByAdmin(req, res)
);

export default router;
