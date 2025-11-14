import { Request, Response } from "express";
import { questionService } from "../services/question.service";

export class QuestionController {
  async create(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      const payload = {
        ...req.body,
        createdBy: user.userId,
      };

      const question = await questionService.createQuestion(payload);
      return res.apiSuccess?.(question, 'Question created successfully', 201);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/create', title: 'Create Error', status: 400, detail: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const questions = await questionService.getAllQuestions();
      return res.apiSuccess?.(questions, 'Questions retrieved successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const question = await questionService.getQuestionById(req.params.id);
      if (!question) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Question not found' });
      return res.apiSuccess?.(question, 'Question retrieved successfully', 200);
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
        updatedBy: user.userId,
      };

      const updated = await questionService.updateQuestion(req.params.id, payload);
      if (!updated) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Question not found' });

      return res.apiSuccess?.(updated, 'Question updated successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/update', title: 'Update Error', status: 400, detail: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      const result = await questionService.deleteQuestionWithOwnerCheck(
        req.params.id,
        user.userId,
        user.role
      );

      if (!result) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Question not found' });
      if (result.reason === "not_owner")
        return res.apiError?.({ type: '/errors/forbidden', title: 'Forbidden', status: 403, detail: 'Teacher chỉ có thể xoá Question do chính mình tạo' });
      if (result.reason === "forbidden")
        return res.apiError?.({ type: '/errors/forbidden', title: 'Forbidden', status: 403, detail: 'Bạn không có quyền xoá Question' });

      return res.apiSuccess?.(null, 'Question deleted successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/delete', title: 'Delete Error', status: 500, detail: err.message });
    }
  }
}

export const questionController = new QuestionController();
