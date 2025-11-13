"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attemptService = void 0;
const attempt_model_1 = __importDefault(require("../models/attempt.model"));
class AttemptService {
    async createAttempt(data) {
        return attempt_model_1.default.create(data);
    }
    async getAllAttempts() {
        return attempt_model_1.default.find()
            .populate("userId")
            .populate("assessmentId")
            .populate("answers.questionId")
            .populate("answers.answerId");
    }
    async getAttemptById(id) {
        return attempt_model_1.default.findById(id)
            .populate("userId")
            .populate("assessmentId")
            .populate("answers.questionId")
            .populate("answers.answerId");
    }
    async getAttemptsByUser(userId) {
        return attempt_model_1.default.find({ userId })
            .populate("assessmentId")
            .populate("answers.questionId")
            .populate("answers.answerId");
    }
    async updateAttempt(id, updates) {
        return attempt_model_1.default.findByIdAndUpdate(id, updates, { new: true });
    }
    async deleteAttempt(id) {
        return attempt_model_1.default.findByIdAndDelete(id);
    }
}
exports.attemptService = new AttemptService();
