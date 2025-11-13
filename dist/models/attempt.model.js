"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const attemptAnswerSchema = new mongoose_1.Schema({
    questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Question", required: true },
    answerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Answer", required: true },
    isCorrect: { type: Boolean, default: false },
}, { _id: false });
const attemptSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    assessmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Assessment", required: true },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
    totalScore: { type: Number, default: 0 },
    answers: [attemptAnswerSchema],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Attempt", attemptSchema);
