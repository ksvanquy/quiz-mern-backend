import { Request, Response } from "express";
import { assessmentService } from "../services/assessment.service";

export class AssessmentController {
  async create(req: Request, res: Response) {
    try {
      const user = req.user; // đã có type { userId, role }

      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      const payload = {
        ...req.body,
        createdBy: user.userId, // ✅ dùng userId từ JWT
      };

      const assessment = await assessmentService.createAssessment(payload);

      return res.apiSuccess?.(assessment, 'Assessment created successfully', 201);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/create', title: 'Create Error', status: 400, detail: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const assessments = await assessmentService.getAllAssessments();
      return res.apiSuccess?.(assessments, 'Assessments retrieved successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const assessment = await assessmentService.getAssessmentById(req.params.id);
      if (!assessment) {
        return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Assessment not found' });
      }
      return res.apiSuccess?.(assessment, 'Assessment retrieved successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      const payload = {
        ...req.body,
        updatedBy: user.userId, // ✅ updatedBy cũng từ JWT
      };

      const updated = await assessmentService.updateAssessment(req.params.id, payload);

      if (!updated) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Assessment not found' });

      return res.apiSuccess?.(updated, 'Assessment updated successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/update', title: 'Update Error', status: 400, detail: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      const result = await assessmentService.deleteAssessmentWithOwnerCheck(
        req.params.id,
        user.userId, // ✅ dùng userId từ JWT
        user.role
      );

      if (!result) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Assessment not found' });
      if (result.reason === "not_owner")
        return res.apiError?.({ type: '/errors/forbidden', title: 'Forbidden', status: 403, detail: 'Teacher chỉ có thể xoá Assessment do chính mình tạo' });
      if (result.reason === "forbidden")
        return res.apiError?.({ type: '/errors/forbidden', title: 'Forbidden', status: 403, detail: 'Bạn không có quyền xoá Assessment' });

      return res.apiSuccess?.(null, 'Assessment deleted successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/delete', title: 'Delete Error', status: 500, detail: err.message });
    }
  }

}

export const assessmentController = new AssessmentController();
