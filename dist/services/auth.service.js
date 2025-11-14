"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateTokens_1 = require("../utils/generateTokens");
const verifyToken_1 = require("../utils/verifyToken");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    // Register user bình thường (role luôn là student)
    async register(name, email, password) {
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser)
            throw new Error("Email đã tồn tại");
        const hashedPassword = await bcrypt_1.default.hash(password, 12); // Increased from 10 to 12 for better security
        const user = new user_model_1.default({ name, email, password: hashedPassword, role: "student" });
        await user.save();
        const { password: _pwd, ...userData } = user.toObject();
        return userData;
    }
    // Admin tạo user với role tùy ý
    async createUserByAdmin(name, email, password, role) {
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser)
            throw new Error("Email đã tồn tại");
        const hashedPassword = await bcrypt_1.default.hash(password, 12); // Increased from 10 to 12 for better security
        const user = new user_model_1.default({ name, email, password: hashedPassword, role });
        await user.save();
        const { password: _pwd, ...userData } = user.toObject();
        return userData;
    }
    // Login + trả access + refresh token
    async login(email, password) {
        const user = await user_model_1.default.findOne({ email });
        if (!user)
            throw new Error("Email không tồn tại");
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            throw new Error("Sai mật khẩu");
        const accessToken = (0, generateTokens_1.generateAccessToken)({ userId: user._id, role: user.role });
        const refreshToken = (0, generateTokens_1.generateRefreshToken)({ userId: user._id, role: user.role });
        // Hash the refresh token before saving to DB to avoid storing raw tokens
        const hashed = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        user.refreshTokens.push(hashed);
        await user.save();
        const { password: _pwd, refreshTokens, ...userData } = user.toObject();
        return { accessToken, refreshToken, user: userData };
    }
    // Refresh token
    async refreshToken(oldRefreshToken) {
        let payload;
        try {
            payload = (0, verifyToken_1.verifyRefreshToken)(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret");
        }
        catch {
            throw new Error("Refresh token không hợp lệ hoặc hết hạn");
        }
        const user = await user_model_1.default.findById(payload.userId);
        if (!user)
            throw new Error("User không tồn tại");
        // Kiểm tra token có còn trong DB không (compare hashed value)
        const oldHash = crypto_1.default.createHash('sha256').update(oldRefreshToken).digest('hex');
        if (!user.refreshTokens.includes(oldHash))
            throw new Error("Refresh token đã bị revoke");
        // Tạo token mới
        const accessToken = (0, generateTokens_1.generateAccessToken)({ userId: user._id, role: user.role });
        const refreshToken = (0, generateTokens_1.generateRefreshToken)({ userId: user._id, role: user.role });
        // Xoá token cũ (hashed) và thêm token mới (hashed)
        user.refreshTokens = user.refreshTokens.filter(t => t !== oldHash);
        const newHash = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        user.refreshTokens.push(newHash);
        await user.save();
        return { accessToken, refreshToken };
    }
    // Logout
    async logout(refreshToken) {
        const payload = require("jsonwebtoken").decode(refreshToken);
        if (!payload)
            return;
        const user = await user_model_1.default.findById(payload.userId);
        if (!user)
            return;
        // Remove hashed version of the token
        const hashed = crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        user.refreshTokens = user.refreshTokens.filter(t => t !== hashed);
        await user.save();
    }
}
exports.AuthService = AuthService;
