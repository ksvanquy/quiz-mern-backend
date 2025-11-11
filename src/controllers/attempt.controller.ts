import { Request, Response } from "express";
import { attemptService } from "../services/attempt.service";

export class AttemptController {
  async create(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const payload = {
        ...req.body,
        userId: user.userId, // lấy từ JWT
      };

      const attempt = await attemptService.createAttempt(payload);
      return res.status(201).json(attempt);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      let attempts;
      if (user.role === "admin") {
        attempts = await attemptService.getAllAttempts();
      } else {
        attempts = await attemptService.getAttemptsByUser(user.userId);
      }

      return res.json(attempts);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const attempt = await attemptService.getAttemptById(req.params.id);
      if (!attempt) return res.status(404).json({ message: "Attempt not found" });

      // check quyền: non-admin chỉ xem attempt của mình
      if (user.role !== "admin" && attempt.userId.toString() !== user.userId) {
        return res.status(403).json({ message: "Không có quyền xem attempt này" });
      }

      return res.json(attempt);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const attempt = await attemptService.updateAttempt(req.params.id, req.body);
      if (!attempt) return res.status(404).json({ message: "Attempt not found" });

      return res.json(attempt);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      // non-admin không được xoá attempt
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Chỉ admin mới có quyền xoá attempt" });
      }

      const attempt = await attemptService.deleteAttempt(req.params.id);
      if (!attempt) return res.status(404).json({ message: "Attempt not found" });

      return res.json({ message: "Attempt deleted" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export const attemptController = new AttemptController();
