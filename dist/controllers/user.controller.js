"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const userService = new user_service_1.UserService();
class UserController {
    // GET /api/users
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // GET /api/users/:id
    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            if (!user)
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            res.json(user);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // PUT /api/users/:id
    async updateUser(req, res) {
        try {
            const updates = req.body;
            const user = await userService.updateUser(req.params.id, updates);
            if (!user)
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            res.json(user);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // DELETE /api/users/:id
    async deleteUser(req, res) {
        try {
            const result = await userService.deleteUser(req.params.id);
            res.json(result);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    // GET /api/users/me
    async getProfile(req, res) {
        res.json(req.user); // user đã được gắn bởi authenticate middleware
    }
    // PUT /api/users/me
    async updateProfile(req, res) {
        try {
            const updates = { ...req.body };
            delete updates.role; // không cho sửa role
            if (updates.password) {
                const bcrypt = require("bcrypt");
                updates.password = await bcrypt.hash(updates.password, 10);
            }
            const user = await userService.updateUser(req.user.userId, updates);
            res.json(user);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}
exports.UserController = UserController;
