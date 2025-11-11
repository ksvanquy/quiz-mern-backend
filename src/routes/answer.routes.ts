import { Router } from "express";
import { answerController } from "../controllers/answer.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.post("/", authenticate, authorize(["admin", "teacher"]), answerController.create);
router.get("/", answerController.getAll);
router.get("/:id", answerController.getById);
router.put("/:id", authenticate, authorize(["admin", "teacher"]), answerController.update);
router.delete("/:id", authenticate, answerController.delete); // check owner trong controller/service

export default router;
