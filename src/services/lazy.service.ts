import Node from "../models/node.model";
import Assessment from "../models/assessment.model";
import Question from "../models/question.model";
import Answer from "../models/answer.model";

export class LazyService {
  // ---------------- Node ----------------
  async getNodesByParent(parentId: string | null) {
    if (!parentId || parentId === "null") parentId = null;
    return Node.find({ parentId }).lean();
  }

  // ---------------- Assessment ----------------
  async getAssessmentsByNode(nodeId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const total = await Assessment.countDocuments({ nodeId });
    const assessments = await Assessment.find({ nodeId })
      .skip(skip)
      .limit(limit)
      .lean();

    return { total, page, limit, assessments };
  }

  // ---------------- Question ----------------
  async getQuestionsByAssessment(assessmentId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const total = await Question.countDocuments({ assessmentId });
    const questions = await Question.find({ assessmentId })
      .skip(skip)
      .limit(limit)
      .lean();

    return { total, page, limit, questions };
  }

  // ---------------- Answer ----------------
  async getAnswersByQuestion(questionId: string) {
    return Answer.find({ questionId }).lean();
  }
}
