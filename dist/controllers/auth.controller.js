"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    // Register bình thường (role luôn student)
    async register(req, res) {
        try {
            const { name, email, password } = req.body; // ignore role từ client
            const user = await authService.register(name, email, password);
            res.status(201).json({
                message: "Đăng ký thành công",
                userId: user._id,
                user, // trả về thông tin user safe
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    // Admin tạo user với role tùy ý
    async createUserByAdmin(req, res) {
        try {
            const { name, email, password, role } = req.body;
            // TODO: Kiểm tra quyền admin trước khi cho tạo
            const user = await authService.createUserByAdmin(name, email, password, role);
            res.status(201).json({
                message: "Tạo user thành công",
                userId: user._id,
                user,
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json({ message: "Đăng nhập thành công", ...result });
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            const tokens = await authService.refreshToken(refreshToken);
            res.json(tokens);
        }
        catch (err) {
            res.status(401).json({ message: err.message });
        }
    }
    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            await authService.logout(refreshToken);
            res.json({ message: "Đã logout" });
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}
exports.AuthController = AuthController;
