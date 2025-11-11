import Attempt, { IAttempt } from "../models/attempt.model";

class AttemptService {
  async createAttempt(data: Partial<IAttempt>) {
    return Attempt.create(data);
  }

  async getAllAttempts() {
    return Attempt.find()
      .populate("userId")
      .populate("assessmentId")
      .populate("answers.questionId")
      .populate("answers.answerId");
  }

  async getAttemptById(id: string) {
    return Attempt.findById(id)
      .populate("userId")
      .populate("assessmentId")
      .populate("answers.questionId")
      .populate("answers.answerId");
  }

  async getAttemptsByUser(userId: string) {
    return Attempt.find({ userId })
      .populate("assessmentId")
      .populate("answers.questionId")
      .populate("answers.answerId");
  }

  async updateAttempt(id: string, updates: Partial<IAttempt>) {
    return Attempt.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteAttempt(id: string) {
    return Attempt.findByIdAndDelete(id);
  }
}

export const attemptService = new AttemptService();
