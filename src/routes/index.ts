import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import nodeRoutes from "./node.routes";
import assessmentRoutes from "./assessment.routes";
import questionRoutes from "./question.routes";
import answerRoutes from "./answer.routes";
import attemptRoutes from "./attempt.routes";
import lazyRoutes from "./lazy.routes";


const router = Router();

// ✅ Gom tất cả route modules với prefix thống nhất
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/nodes", nodeRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/questions", questionRoutes);
router.use("/answers", answerRoutes);
router.use("/attempts", attemptRoutes);
router.use("/lazy", lazyRoutes);


export default router;
