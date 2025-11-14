import { Request, Response } from "express";
import { LazyService } from "../services/lazy.service";

const lazyService = new LazyService();

export class LazyController {
  // ---------------- Node ----------------
  async getNodesByParent(req: Request, res: Response): Promise<void> {
    try {
      const { parentId } = req.query;
      const nodes = await lazyService.getNodesByParent(parentId as string);
      res.apiSuccess?.(nodes, 'Nodes retrieved successfully', 200);
    } catch (err: any) {
      res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  // ---------------- Assessment ----------------
  async getAssessmentsByNode(req: Request, res: Response): Promise<void> {
    try {
      const { nodeId, page = "1", limit = "10" } = req.query;
      const result = await lazyService.getAssessmentsByNode(
        nodeId as string,
        Number(page),
        Number(limit)
      );
      res.apiSuccess?.(result, 'Assessments retrieved successfully', 200);
    } catch (err: any) {
      res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  // ---------------- Question ----------------
  async getQuestionsByAssessment(req: Request, res: Response): Promise<void> {
    try {
      const { assessmentId, page = "1", limit = "10" } = req.query;
      const result = await lazyService.getQuestionsByAssessment(
        assessmentId as string,
        Number(page),
        Number(limit)
      );
      res.apiSuccess?.(result, 'Questions retrieved successfully', 200);
    } catch (err: any) {
      res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }

  // ---------------- Answer ----------------
  async getAnswersByQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { questionId } = req.query;
      const answers = await lazyService.getAnswersByQuestion(questionId as string);
      res.apiSuccess?.(answers, 'Answers retrieved successfully', 200);
    } catch (err: any) {
      res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  }
}
