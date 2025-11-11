import { Request, Response } from "express";
import { questionService } from "../services/question.service";

export class QuestionController {
  async create(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const payload = {
        ...req.body,
        createdBy: user.userId,
      };

      const question = await questionService.createQuestion(payload);
      return res.status(201).json(question);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const questions = await questionService.getAllQuestions();
      return res.json(questions);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const question = await questionService.getQuestionById(req.params.id);
      if (!question) return res.status(404).json({ error: "Question not found" });
      return res.json(question);
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

      const updated = await questionService.updateQuestion(req.params.id, payload);
      if (!updated) return res.status(404).json({ error: "Question not found" });

      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const result = await questionService.deleteQuestionWithOwnerCheck(
        req.params.id,
        user.userId,
        user.role
      );

      if (!result) return res.status(404).json({ message: "Question not found" });
      if (result.reason === "not_owner")
        return res.status(403).json({ message: "Teacher chỉ có thể xoá Question do chính mình tạo" });
      if (result.reason === "forbidden")
        return res.status(403).json({ message: "Bạn không có quyền xoá Question" });

      return res.json({ message: "Question deleted" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export const questionController = new QuestionController();
