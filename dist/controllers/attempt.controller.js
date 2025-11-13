"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attemptController = exports.AttemptController = void 0;
const attempt_service_1 = require("../services/attempt.service");
class AttemptController {
    async create(req, res) {
        try {
            const user = req.user;
            if (!user)
                return res.status(401).json({ message: "Unauthorized" });
            const payload = {
                ...req.body,
                userId: user.userId, // lấy từ JWT
            };
            const attempt = await attempt_service_1.attemptService.createAttempt(payload);
            return res.status(201).json(attempt);
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async getAll(req, res) {
        try {
            const user = req.user;
            if (!user)
                return res.status(401).json({ message: "Unauthorized" });
            let attempts;
            if (user.role === "admin") {
                attempts = await attempt_service_1.attemptService.getAllAttempts();
            }
            else {
                attempts = await attempt_service_1.attemptService.getAttemptsByUser(user.userId);
            }
            return res.json(attempts);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    async getById(req, res) {
        try {
            const user = req.user;
            if (!user)
                return res.status(401).json({ message: "Unauthorized" });
            const attempt = await attempt_service_1.attemptService.getAttemptById(req.params.id);
            if (!attempt)
                return res.status(404).json({ message: "Attempt not found" });
            // check quyền: non-admin chỉ xem attempt của mình
            if (user.role !== "admin" && attempt.userId.toString() !== user.userId) {
                return res.status(403).json({ message: "Không có quyền xem attempt này" });
            }
            return res.json(attempt);
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
            const attempt = await attempt_service_1.attemptService.updateAttempt(req.params.id, req.body);
            if (!attempt)
                return res.status(404).json({ message: "Attempt not found" });
            return res.json(attempt);
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
            // non-admin không được xoá attempt
            if (user.role !== "admin") {
                return res.status(403).json({ message: "Chỉ admin mới có quyền xoá attempt" });
            }
            const attempt = await attempt_service_1.attemptService.deleteAttempt(req.params.id);
            if (!attempt)
                return res.status(404).json({ message: "Attempt not found" });
            return res.json({ message: "Attempt deleted" });
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.AttemptController = AttemptController;
exports.attemptController = new AttemptController();
