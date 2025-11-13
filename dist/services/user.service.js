"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
class UserService {
    // Lấy tất cả user
    async getAllUsers() {
        return user_model_1.default.find().select("-password").lean().exec();
    }
    // Lấy user theo id
    async getUserById(id) {
        return user_model_1.default.findById(id).select("-password").lean().exec();
    }
    // Cập nhật user
    async updateUser(id, updates) {
        if (updates.password) {
            const bcrypt = require("bcrypt");
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const user = await user_model_1.default.findByIdAndUpdate(id, updates, { new: true }).select("-password").lean().exec();
        return user;
    }
    // Xóa user
    async deleteUser(id) {
        const user = await user_model_1.default.findByIdAndDelete(id).lean().exec();
        if (!user)
            throw new Error("User không tồn tại");
        return { message: "User đã bị xóa" };
    }
    // Lấy profile của chính user
    async getProfile(userId) {
        return user_model_1.default.findById(userId).select("-password").lean().exec();
    }
    // Cập nhật profile của chính user (không cho sửa role)
    async updateProfile(userId, updates) {
        const { role, ...restUpdates } = updates; // loại bỏ role nếu có
        if (restUpdates.password) {
            const bcrypt = require("bcrypt");
            restUpdates.password = await bcrypt.hash(restUpdates.password, 10);
        }
        const user = await user_model_1.default.findByIdAndUpdate(userId, restUpdates, { new: true }).select("-password").lean().exec();
        return user;
    }
}
exports.UserService = UserService;
