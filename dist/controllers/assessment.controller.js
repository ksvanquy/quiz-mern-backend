"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentController = exports.AssessmentController = void 0;
const assessment_service_1 = require("../services/assessment.service");
class AssessmentController {
    async create(req, res) {
        try {
            const user = req.user; // đã có type { userId, role }
            if (!user)
                return res.status(401).json({ message: "Unauthorized" });
            const payload = {
                ...req.body,
                createdBy: user.userId, // ✅ dùng userId từ JWT
            };
            const assessment = await assessment_service_1.assessmentService.createAssessment(payload);
            return res.status(201).json(assessment);
        }
        catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
    async getAll(req, res) {
        try {
            const assessments = await assessment_service_1.assessmentService.getAllAssessments();
            return res.json(assessments);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    async getById(req, res) {
        try {
            const assessment = await assessment_service_1.assessmentService.getAssessmentById(req.params.id);
            if (!assessment) {
                return res.status(404).json({ error: "Assessment not found" });
            }
            return res.json(assessment);
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
                updatedBy: user.userId, // ✅ updatedBy cũng từ JWT
            };
            const updated = await assessment_service_1.assessmentService.updateAssessment(req.params.id, payload);
            if (!updated)
                return res.status(404).json({ error: "Assessment not found" });
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
            const result = await assessment_service_1.assessmentService.deleteAssessmentWithOwnerCheck(req.params.id, user.userId, // ✅ dùng userId từ JWT
            user.role);
            if (!result)
                return res.status(404).json({ message: "Assessment not found" });
            if (result.reason === "not_owner")
                return res.status(403).json({ message: "Teacher chỉ có thể xoá Assessment do chính mình tạo" });
            if (result.reason === "forbidden")
                return res.status(403).json({ message: "Bạn không có quyền xoá Assessment" });
            return res.json({ message: "Assessment deleted" });
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.AssessmentController = AssessmentController;
exports.assessmentController = new AssessmentController();
