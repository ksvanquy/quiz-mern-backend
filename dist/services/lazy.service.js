"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyService = void 0;
const node_model_1 = __importDefault(require("../models/node.model"));
const assessment_model_1 = __importDefault(require("../models/assessment.model"));
const question_model_1 = __importDefault(require("../models/question.model"));
const answer_model_1 = __importDefault(require("../models/answer.model"));
class LazyService {
    // ---------------- Node ----------------
    async getNodesByParent(parentId) {
        if (!parentId || parentId === "null")
            parentId = null;
        return node_model_1.default.find({ parentId }).lean();
    }
    // ---------------- Assessment ----------------
    async getAssessmentsByNode(nodeId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const total = await assessment_model_1.default.countDocuments({ nodeId });
        const assessments = await assessment_model_1.default.find({ nodeId })
            .skip(skip)
            .limit(limit)
            .lean();
        return { total, page, limit, assessments };
    }
    // ---------------- Question ----------------
    async getQuestionsByAssessment(assessmentId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const total = await question_model_1.default.countDocuments({ assessmentId });
        const questions = await question_model_1.default.find({ assessmentId })
            .skip(skip)
            .limit(limit)
            .lean();
        return { total, page, limit, questions };
    }
    // ---------------- Answer ----------------
    async getAnswersByQuestion(questionId) {
        return answer_model_1.default.find({ questionId }).lean();
    }
}
exports.LazyService = LazyService;
