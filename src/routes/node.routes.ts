import { Router } from "express";
import { NodeController } from "../controllers/node.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();
const controller = new NodeController();

router.post(
  "/",
  authenticate,
  authorize(["admin", "teacher"]),
  controller.createNode
);

router.get("/", controller.getAllNodes);

router.get("/:id", controller.getNodeById);

router.put(
  "/:id",
  authenticate,
  authorize(["admin", "teacher"]),
  controller.updateNode
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  controller.deleteNode
);

export default router;
