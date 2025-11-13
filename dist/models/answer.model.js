"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const answerSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
    questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Question", required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Answer", answerSchema);
