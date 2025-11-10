import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const authController = new AuthController();

// User đăng ký bình thường (role mặc định student)
router.post("/register", (req, res) => authController.register(req, res));

// Login
router.post("/login", (req, res) => authController.login(req, res));

// Lấy access token mới
router.post("/refresh", (req, res) => authController.refresh(req, res));

// Admin tạo user với role tùy ý
router.post(
  "/create-user",
  authenticate,
  authorize(["admin"]),
  (req, res) => authController.createUserByAdmin(req, res)
);
export default router;
