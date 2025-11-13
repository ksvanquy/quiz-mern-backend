"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const assessmentSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ["quiz", "exam", "test"], required: true },
    nodeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Node", required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Assessment", assessmentSchema);
