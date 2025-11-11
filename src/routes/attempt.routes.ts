import { Router } from "express";
import { attemptController } from "../controllers/attempt.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Tất cả route đều cần login
router.use(authenticate);

router.post("/", attemptController.create);
router.get("/", attemptController.getAll);
router.get("/:id", attemptController.getById);
router.put("/:id", attemptController.update);
router.delete("/:id", attemptController.delete); // chỉ admin

export default router;
