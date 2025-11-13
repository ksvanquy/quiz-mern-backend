"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionService = void 0;
const question_model_1 = __importDefault(require("../models/question.model"));
class QuestionService {
    async createQuestion(data) {
        return question_model_1.default.create(data);
    }
    async getAllQuestions() {
        return question_model_1.default.find().populate("assessmentId").populate("createdBy");
    }
    async getQuestionById(id) {
        return question_model_1.default.findById(id).populate("assessmentId").populate("createdBy");
    }
    async updateQuestion(id, updates) {
        return question_model_1.default.findByIdAndUpdate(id, updates, { new: true });
    }
    async deleteQuestionWithOwnerCheck(id, userId, role) {
        const question = await question_model_1.default.findById(id);
        if (!question)
            return null;
        if (role === "admin") {
            await question.deleteOne();
            return { reason: "ok" };
        }
        if (role === "teacher") {
            if (question.createdBy.toString() !== userId) {
                return { reason: "not_owner" };
            }
            await question.deleteOne();
            return { reason: "ok" };
        }
        return { reason: "forbidden" };
    }
}
exports.questionService = new QuestionService();
