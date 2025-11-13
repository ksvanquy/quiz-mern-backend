"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nodeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["category", "subcategory", "topic"], required: true },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Node", default: null },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });
// Unique index: tên node phải duy nhất trong cùng một parent
nodeSchema.index({ name: 1, parentId: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)("Node", nodeSchema);
