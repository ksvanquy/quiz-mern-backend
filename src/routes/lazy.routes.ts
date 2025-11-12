import { Router } from "express";
import { LazyController } from "../controllers/lazy.controller";

const router = Router();
const lazyController = new LazyController();

router.get("/nodes", (req, res) => lazyController.getNodesByParent(req, res));
router.get("/assessments", (req, res) => lazyController.getAssessmentsByNode(req, res));
router.get("/questions", (req, res) => lazyController.getQuestionsByAssessment(req, res));
router.get("/answers", (req, res) => lazyController.getAnswersByQuestion(req, res));

export default router;
