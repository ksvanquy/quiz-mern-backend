import { Router } from "express";
import { questionController } from "../controllers/question.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.post("/", authenticate, authorize(["admin", "teacher"]), questionController.create);
router.get("/", questionController.getAll);
router.get("/:id", questionController.getById);
router.put("/:id", authenticate, authorize(["admin", "teacher"]), questionController.update);
router.delete("/:id", authenticate, questionController.delete); // delete kiểm tra owner trong controller/service

export default router;
