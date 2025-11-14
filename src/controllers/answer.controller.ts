import { Request, Response } from "express";
import { answerService } from "../services/answer.service";

export class AnswerController {
  async create(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      const payload = {
        ...req.body,
        createdBy: user.userId,
      };

      const answer = await answerService.createAnswer(payload);
      return res.apiSuccess?.(answer, 'Answer created successfully', 201);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/create', title: 'Create Error', status: 400, detail: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const answers = await answerService.getAllAnswers();
      return res.apiSuccess?.(answers, 'Answers retrieved successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const answer = await answerService.getAnswerById(req.params.id);
      if (!answer) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Answer not found' });
      return res.apiSuccess?.(answer, 'Answer retrieved successfully', 200);
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

      const updated = await answerService.updateAnswer(req.params.id, payload);
      if (!updated) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Answer not found' });

      return res.apiSuccess?.(updated, 'Answer updated successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/update', title: 'Update Error', status: 400, detail: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.apiError?.({ type: '/errors/auth', title: 'Authentication Error', status: 401, detail: 'Unauthorized' });

      const result = await answerService.deleteAnswerWithOwnerCheck(
        req.params.id,
        user.userId,
        user.role
      );

      if (!result) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Answer not found' });
      if (result.reason === "not_owner")
        return res.apiError?.({ type: '/errors/forbidden', title: 'Forbidden', status: 403, detail: 'Teacher chỉ có thể xoá Answer do chính mình tạo' });
      if (result.reason === "forbidden")
        return res.apiError?.({ type: '/errors/forbidden', title: 'Forbidden', status: 403, detail: 'Bạn không có quyền xoá Answer' });

      return res.apiSuccess?.(null, 'Answer deleted successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/delete', title: 'Delete Error', status: 500, detail: err.message });
    }
  }
}

export const answerController = new AnswerController();
