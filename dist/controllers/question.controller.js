"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionController = exports.QuestionController = void 0;
const question_service_1 = require("../services/question.service");
class QuestionController {
    async create(req, res) {
        try {
            const user = req.user;
            if (!user)
                return res.status(401).json({ message: "Unauthorized" });
            const payload = {
                ...req.body,
                createdBy: user.userId,
            };
            const question = await question_service_1.questionService.createQuestion(payload);
            return res.status(201).json(question);
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async getAll(req, res) {
        try {
            const questions = await question_service_1.questionService.getAllQuestions();
            return res.json(questions);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    async getById(req, res) {
        try {
            const question = await question_service_1.questionService.getQuestionById(req.params.id);
            if (!question)
                return res.status(404).json({ error: "Question not found" });
            return res.json(question);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    async update(req, res) {
        try {
            const user = req.user;
            if (!user)
                return res.status(401).json({ message: "Unauthorized" });
            const payload = {
                ...req.body,
                updatedBy: user.userId,
            };
            const updated = await question_service_1.questionService.updateQuestion(req.params.id, payload);
            if (!updated)
                return res.status(404).json({ error: "Question not found" });
            return res.json(updated);
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async delete(req, res) {
        try {
            const user = req.user;
            if (!user)
                return res.status(401).json({ message: "Unauthorized" });
            const result = await question_service_1.questionService.deleteQuestionWithOwnerCheck(req.params.id, user.userId, user.role);
            if (!result)
                return res.status(404).json({ message: "Question not found" });
            if (result.reason === "not_owner")
                return res.status(403).json({ message: "Teacher chỉ có thể xoá Question do chính mình tạo" });
            if (result.reason === "forbidden")
                return res.status(403).json({ message: "Bạn không có quyền xoá Question" });
            return res.json({ message: "Question deleted" });
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.QuestionController = QuestionController;
exports.questionController = new QuestionController();
