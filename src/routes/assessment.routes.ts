import { Router } from "express";
import { assessmentController } from "../controllers/assessment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

/* CREATE Assessment */
router.post(
  "/",
  authenticate,
  authorize(["admin", "teacher"]),
  assessmentController.create
);

/* GET All */
router.get(
  "/",
  authenticate,
  authorize(["admin", "teacher"]),
  assessmentController.getAll
);

/* GET by ID */
router.get(
  "/:id",
  authenticate,
  authorize(["admin", "teacher"]),
  assessmentController.getById
);

/* UPDATE */
router.put(
  "/:id",
  authenticate,
  authorize(["admin", "teacher"]),
  assessmentController.update
);

/* DELETE – ONLY admin */
router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "teacher"]),
  assessmentController.delete
);

export default router;
