import { Request, Response } from "express";
import { assessmentService } from "../services/assessment.service";

export class AssessmentController {
  async create(req: Request, res: Response) {
    try {
      const result = await assessmentService.createAssessment(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await assessmentService.getAllAssessments();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const result = await assessmentService.getAssessmentById(req.params.id);
      if (!result) return res.status(404).json({ error: "Assessment not found" });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const result = await assessmentService.updateAssessment(req.params.id, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const result = await assessmentService.deleteAssessmentWithOwnerCheck(
        req.params.id,
        user.id,
        user.role
      );

      if (!result) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      if (result.reason === "not_owner") {
        return res.status(403).json({
          message: "Teacher chỉ có thể xoá Assessment do chính mình tạo"
        });
      }

      if (result.reason === "forbidden") {
        return res.status(403).json({
          message: "Bạn không có quyền xoá Assessment"
        });
      }

      return res.json({ message: "Assessment deleted" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

}

export const assessmentController = new AssessmentController();
