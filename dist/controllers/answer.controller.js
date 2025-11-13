"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerController = exports.AnswerController = void 0;
const answer_service_1 = require("../services/answer.service");
class AnswerController {
    async create(req, res) {
        try {
            const user = req.user;
            if (!user)
                return res.status(401).json({ message: "Unauthorized" });
            const payload = {
                ...req.body,
                createdBy: user.userId,
            };
            const answer = await answer_service_1.answerService.createAnswer(payload);
            return res.status(201).json(answer);
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async getAll(req, res) {
        try {
            const answers = await answer_service_1.answerService.getAllAnswers();
            return res.json(answers);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    async getById(req, res) {
        try {
            const answer = await answer_service_1.answerService.getAnswerById(req.params.id);
            if (!answer)
                return res.status(404).json({ error: "Answer not found" });
            return res.json(answer);
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
            const updated = await answer_service_1.answerService.updateAnswer(req.params.id, payload);
            if (!updated)
                return res.status(404).json({ error: "Answer not found" });
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
            const result = await answer_service_1.answerService.deleteAnswerWithOwnerCheck(req.params.id, user.userId, user.role);
            if (!result)
                return res.status(404).json({ message: "Answer not found" });
            if (result.reason === "not_owner")
                return res.status(403).json({ message: "Teacher chỉ có thể xoá Answer do chính mình tạo" });
            if (result.reason === "forbidden")
                return res.status(403).json({ message: "Bạn không có quyền xoá Answer" });
            return res.json({ message: "Answer deleted" });
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.AnswerController = AnswerController;
exports.answerController = new AnswerController();
