import { Request, Response } from "express";
import { assessmentService } from "../services/assessment.service";

export class AssessmentController {
  async create(req: Request, res: Response) {
    try {
      const user = req.user; // đã có type { userId, role }

      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const payload = {
        ...req.body,
        createdBy: user.userId, // ✅ dùng userId từ JWT
      };

      const assessment = await assessmentService.createAssessment(payload);

      return res.status(201).json(assessment);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }


  async getAll(req: Request, res: Response) {
    try {
      const assessments = await assessmentService.getAllAssessments();
      return res.json(assessments);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const assessment = await assessmentService.getAssessmentById(req.params.id);
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      return res.json(assessment);
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
        updatedBy: user.userId, // ✅ updatedBy cũng từ JWT
      };

      const updated = await assessmentService.updateAssessment(req.params.id, payload);

      if (!updated) return res.status(404).json({ error: "Assessment not found" });

      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const result = await assessmentService.deleteAssessmentWithOwnerCheck(
        req.params.id,
        user.userId, // ✅ dùng userId từ JWT
        user.role
      );

      if (!result) return res.status(404).json({ message: "Assessment not found" });
      if (result.reason === "not_owner")
        return res.status(403).json({ message: "Teacher chỉ có thể xoá Assessment do chính mình tạo" });
      if (result.reason === "forbidden")
        return res.status(403).json({ message: "Bạn không có quyền xoá Assessment" });

      return res.json({ message: "Assessment deleted" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

}

export const assessmentController = new AssessmentController();
