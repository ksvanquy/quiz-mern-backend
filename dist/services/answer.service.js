"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerService = void 0;
const answer_model_1 = __importDefault(require("../models/answer.model"));
class AnswerService {
    async createAnswer(data) {
        return answer_model_1.default.create(data);
    }
    async getAllAnswers() {
        return answer_model_1.default.find().populate("questionId").populate("createdBy");
    }
    async getAnswerById(id) {
        return answer_model_1.default.findById(id).populate("questionId").populate("createdBy");
    }
    async updateAnswer(id, updates) {
        return answer_model_1.default.findByIdAndUpdate(id, updates, { new: true });
    }
    async deleteAnswerWithOwnerCheck(id, userId, role) {
        const answer = await answer_model_1.default.findById(id);
        if (!answer)
            return null;
        if (role === "admin") {
            await answer.deleteOne();
            return { reason: "ok" };
        }
        if (role === "teacher") {
            if (answer.createdBy.toString() !== userId) {
                return { reason: "not_owner" };
            }
            await answer.deleteOne();
            return { reason: "ok" };
        }
        return { reason: "forbidden" };
    }
}
exports.answerService = new AnswerService();
