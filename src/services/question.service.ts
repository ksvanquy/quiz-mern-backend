import Question, { IQuestion } from "../models/question.model";

class QuestionService {
  async createQuestion(data: Partial<IQuestion>) {
    return Question.create(data);
  }

  async getAllQuestions() {
    return Question.find().populate("assessmentId").populate("createdBy");
  }

  async getQuestionById(id: string) {
    return Question.findById(id).populate("assessmentId").populate("createdBy");
  }

  async updateQuestion(id: string, updates: Partial<IQuestion>) {
    return Question.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteQuestionWithOwnerCheck(id: string, userId: string, role: string) {
    const question = await Question.findById(id);
    if (!question) return null;

    if (role === "admin") {
      await question.deleteOne();
      return { reason: "ok" };
    }

    if (role === "teacher") {
      if (question.createdBy.toString() !== userId) {
        return { reason: "not_owner" };
      }
      await question.deleteOne();
      return { reason: "ok" };
    }

    return { reason: "forbidden" };
  }
}

export const questionService = new QuestionService();
