import { Request, Response } from "express";
import { attemptService } from "../services/attempt.service";

export class AttemptController {
  async create(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      const payload = {
        ...req.body,
        userId: user.userId, // lấy từ JWT
      };

      const attempt = await attemptService.createAttempt(payload);
      return res.apiSuccess?.(attempt, 'Attempt created successfully', 201);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/create', title: 'Create Error', status: 400, detail: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      let attempts;
      if (user.role === "admin") {
        attempts = await attemptService.getAllAttempts();
      } else {
        attempts = await attemptService.getAttemptsByUser(user.userId);
      }

      return res.apiSuccess?.(attempts, 'Attempts retrieved successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      const attempt = await attemptService.getAttemptById(req.params.id);
      if (!attempt) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Attempt not found' });

      // check quyền: non-admin chỉ xem attempt của mình
      if (user.role !== "admin" && attempt.userId.toString() !== user.userId) {
        return res.apiError?.({ type: '/errors/forbidden', title: 'Forbidden', status: 403, detail: 'Không có quyền xem attempt này' });
      }

      return res.apiSuccess?.(attempt, 'Attempt retrieved successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      const attempt = await attemptService.updateAttempt(req.params.id, req.body);
      if (!attempt) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Attempt not found' });

      return res.apiSuccess?.(attempt, 'Attempt updated successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/update', title: 'Update Error', status: 400, detail: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      // non-admin không được xoá attempt
      if (user.role !== "admin") {
        return res.apiError?.({ type: '/errors/forbidden', title: 'Forbidden', status: 403, detail: 'Chỉ admin mới có quyền xoá attempt' });
      }

      const attempt = await attemptService.deleteAttempt(req.params.id);
      if (!attempt) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Attempt not found' });

      return res.apiSuccess?.(null, 'Attempt deleted successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/delete', title: 'Delete Error', status: 500, detail: err.message });
    }
  }
}

export const attemptController = new AttemptController();
