"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentService = exports.AssessmentService = void 0;
const assessment_model_1 = __importDefault(require("../models/assessment.model"));
const mongoose_1 = require("mongoose");
class AssessmentService {
    async createAssessment(payload) {
        return assessment_model_1.default.create(payload);
    }
    async getAllAssessments() {
        return assessment_model_1.default.find().populate("nodeId");
    }
    async getAssessmentById(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            return null;
        return assessment_model_1.default.findById(id).populate("nodeId");
    }
    async updateAssessment(id, payload) {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            return null;
        return assessment_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    }
    async deleteAssessment(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            return null;
        return assessment_model_1.default.findByIdAndDelete(id);
    }
    async deleteAssessmentWithOwnerCheck(id, userId, role) {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            return null;
        const assessment = await assessment_model_1.default.findById(id);
        if (!assessment)
            return null;
        // Admin thì xóa luôn
        if (role === "admin") {
            await assessment_model_1.default.findByIdAndDelete(id);
            return { deleted: true };
        }
        // Teacher chỉ được xóa bài của chính họ
        if (role === "teacher") {
            if (assessment.createdBy.toString() !== userId.toString()) {
                return { deleted: false, reason: "not_owner" };
            }
            await assessment_model_1.default.findByIdAndDelete(id);
            return { deleted: true };
        }
        return { deleted: false, reason: "forbidden" };
    }
}
exports.AssessmentService = AssessmentService;
exports.assessmentService = new AssessmentService();
