import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";

const userService = new UserService();
const authService = new AuthService();

export class UserController {
  // GET /api/users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.apiSuccess?.(users, 'Users retrieved successfully', 200);
    } catch (err: any) {
      res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  // GET /api/users/:id
  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Người dùng không tồn tại' });
      res.apiSuccess?.(user, 'User retrieved successfully', 200);
    } catch (err: any) {
      res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  // PUT /api/users/:id
  async updateUser(req: Request, res: Response) {
    try {
      const updates = req.body;
      const user = await userService.updateUser(req.params.id, updates);
      if (!user) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Người dùng không tồn tại' });
      res.apiSuccess?.(user, 'User updated successfully', 200);
    } catch (err: any) {
      res.apiError?.({ type: '/errors/update', title: 'Update Error', status: 500, detail: err.message });
    }
  }

  // DELETE /api/users/:id
  async deleteUser(req: Request, res: Response) {
    try {
      const result = await userService.deleteUser(req.params.id);
      res.apiSuccess?.(result, 'User deleted successfully', 200);
    } catch (err: any) {
      res.apiError?.({ type: '/errors/delete', title: 'Delete Error', status: 500, detail: err.message });
    }
  }

  // GET /api/users/me
  async getProfile(req: Request, res: Response) {
    res.apiSuccess?.(req.user, 'Profile retrieved successfully', 200); // user đã được gắn bởi authenticate middleware
  }

  // PUT /api/users/me
  async updateProfile(req: Request, res: Response) {
    try {
      const updates = { ...req.body };
      delete updates.role; // không cho sửa role

      if (updates.password) {
        const bcrypt = require("bcrypt");
        updates.password = await bcrypt.hash(updates.password, 12); // increase from 10 to 12 for better security
      }

      const user = await userService.updateUser(req.user!.userId, updates);
      res.apiSuccess?.(user, 'Profile updated successfully', 200);
    } catch (err: any) {
      res.apiError?.({ type: '/errors/update', title: 'Update Error', status: 500, detail: err.message });
    }
  }

  // GET /api/users/me/sessions - Xem danh sách active sessions
  async getActiveSessions(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const sessions = await authService.getActiveSessions(userId);
      res.apiSuccess?.(
        { sessions, count: sessions.length },
        'Active sessions retrieved successfully',
        200
      );
    } catch (err: any) {
      res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  // POST /api/users/me/sessions/logout - Logout từ device cụ thể
  async logoutDevice(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { deviceId } = req.body;

      if (!deviceId) {
        return res.apiError?.({
          type: '/errors/validation',
          title: 'Validation Error',
          status: 400,
          detail: 'deviceId is required'
        });
      }

      await authService.logoutDevice(userId, deviceId);
      res.apiSuccess?.(null, 'Device logged out successfully', 200);
    } catch (err: any) {
      res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  // POST /api/users/me/sessions/logout-all - Logout từ tất cả devices
  async logoutAll(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      await authService.logoutAll(userId);
      res.clearCookie('refreshToken', { path: '/api/auth' });
      res.apiSuccess?.(null, 'Logged out from all devices successfully', 200);
    } catch (err: any) {
      res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }
}
