import { Request, Response } from "express";
import { answerService } from "../services/answer.service";

export class AnswerController {
  async create(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const payload = {
        ...req.body,
        createdBy: user.userId,
      };

      const answer = await answerService.createAnswer(payload);
      return res.status(201).json(answer);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const answers = await answerService.getAllAnswers();
      return res.json(answers);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const answer = await answerService.getAnswerById(req.params.id);
      if (!answer) return res.status(404).json({ error: "Answer not found" });
      return res.json(answer);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const payload = {
        ...req.body,
        updatedBy: user.userId,
      };

      const updated = await answerService.updateAnswer(req.params.id, payload);
      if (!updated) return res.status(404).json({ error: "Answer not found" });

      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const result = await answerService.deleteAnswerWithOwnerCheck(
        req.params.id,
        user.userId,
        user.role
      );

      if (!result) return res.status(404).json({ message: "Answer not found" });
      if (result.reason === "not_owner")
        return res.status(403).json({ message: "Teacher chỉ có thể xoá Answer do chính mình tạo" });
      if (result.reason === "forbidden")
        return res.status(403).json({ message: "Bạn không có quyền xoá Answer" });

      return res.json({ message: "Answer deleted" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export const answerController = new AnswerController();
