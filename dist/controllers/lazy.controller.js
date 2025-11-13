"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyController = void 0;
const lazy_service_1 = require("../services/lazy.service");
const lazyService = new lazy_service_1.LazyService();
class LazyController {
    // ---------------- Node ----------------
    async getNodesByParent(req, res) {
        try {
            const { parentId } = req.query;
            const nodes = await lazyService.getNodesByParent(parentId);
            res.json(nodes);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    // ---------------- Assessment ----------------
    async getAssessmentsByNode(req, res) {
        try {
            const { nodeId, page = "1", limit = "10" } = req.query;
            const result = await lazyService.getAssessmentsByNode(nodeId, Number(page), Number(limit));
            res.json(result);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    // ---------------- Question ----------------
    async getQuestionsByAssessment(req, res) {
        try {
            const { assessmentId, page = "1", limit = "10" } = req.query;
            const result = await lazyService.getQuestionsByAssessment(assessmentId, Number(page), Number(limit));
            res.json(result);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    // ---------------- Answer ----------------
    async getAnswersByQuestion(req, res) {
        try {
            const { questionId } = req.query;
            const answers = await lazyService.getAnswersByQuestion(questionId);
            res.json(answers);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
exports.LazyController = LazyController;
