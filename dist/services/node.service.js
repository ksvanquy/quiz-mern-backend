"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeService = void 0;
const node_model_1 = __importDefault(require("../models/node.model"));
const mongoose_1 = require("mongoose");
class NodeService {
    // Tạo node, xử lý duplicate
    async createNode(payload) {
        try {
            const node = await node_model_1.default.create(payload);
            return node;
        }
        catch (err) {
            // Duplicate key error
            if (err.code === 11000) {
                throw new Error("Node đã tồn tại trong parent này");
            }
            throw err;
        }
    }
    // Lấy tất cả node
    async getAllNodes() {
        return node_model_1.default.find();
    }
    // Lấy node theo ID
    async getNodeById(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            return null;
        return node_model_1.default.findById(id);
    }
    // Cập nhật node, kiểm tra duplicate
    async updateNode(id, updates) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id))
                return null;
            const node = await node_model_1.default.findByIdAndUpdate(id, updates, { new: true });
            return node;
        }
        catch (err) {
            if (err.code === 11000) {
                throw new Error("Node đã tồn tại trong parent này");
            }
            throw err;
        }
    }
    // Xóa node theo ID
    async deleteNode(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id))
            return;
        await node_model_1.default.findByIdAndDelete(id);
    }
}
exports.NodeService = NodeService;
