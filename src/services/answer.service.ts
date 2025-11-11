import Answer, { IAnswer } from "../models/answer.model";

class AnswerService {
  async createAnswer(data: Partial<IAnswer>) {
    return Answer.create(data);
  }

  async getAllAnswers() {
    return Answer.find().populate("questionId").populate("createdBy");
  }

  async getAnswerById(id: string) {
    return Answer.findById(id).populate("questionId").populate("createdBy");
  }

  async updateAnswer(id: string, updates: Partial<IAnswer>) {
    return Answer.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteAnswerWithOwnerCheck(id: string, userId: string, role: string) {
    const answer = await Answer.findById(id);
    if (!answer) return null;

    if (role === "admin") {
      await answer.deleteOne();
      return { reason: "ok" };
    }

    if (role === "teacher") {
      if (answer.createdBy.toString() !== userId) {
        return { reason: "not_owner" };
      }
      await answer.deleteOne();
      return { reason: "ok" };
    }

    return { reason: "forbidden" };
  }
}

export const answerService = new AnswerService();
