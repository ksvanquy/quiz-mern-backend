import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const userController = new UserController();

// User routes (profile) nên đặt **trước** /:id
router.get("/me", authenticate, (req, res) =>
  userController.getProfile(req, res)
);
router.put("/me", authenticate, (req, res) =>
  userController.updateProfile(req, res) // validate không cho sửa role
);

// Admin routes
router.get("/", authenticate, authorize(["admin"]), (req, res) =>
  userController.getAllUsers(req, res)
);
router.get("/:id", authenticate, authorize(["admin"]), (req, res) =>
  userController.getUserById(req, res)
);
router.put("/:id", authenticate, authorize(["admin"]), (req, res) =>
  userController.updateUser(req, res)
);
router.delete("/:id", authenticate, authorize(["admin"]), (req, res) =>
  userController.deleteUser(req, res)
);

export default router;
