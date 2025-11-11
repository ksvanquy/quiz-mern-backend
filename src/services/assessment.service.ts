import Assessment, { IAssessment } from "../models/assessment.model";
import { Types } from "mongoose";

export class AssessmentService {
  async createAssessment(payload: Partial<IAssessment>) {
    return Assessment.create(payload);
  }

  async getAllAssessments() {
    return Assessment.find().populate("nodeId");
  }

  async getAssessmentById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return Assessment.findById(id).populate("nodeId");
  }

  async updateAssessment(id: string, payload: Partial<IAssessment>) {
    if (!Types.ObjectId.isValid(id)) return null;
    return Assessment.findByIdAndUpdate(id, payload, { new: true });
  }

  async deleteAssessment(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return Assessment.findByIdAndDelete(id);
  }

  async deleteAssessmentWithOwnerCheck(id: string, userId: string, role: string) {
    if (!Types.ObjectId.isValid(id)) return null;

    const assessment = await Assessment.findById(id);
    if (!assessment) return null;

    // Admin thì xóa luôn
    if (role === "admin") {
      await Assessment.findByIdAndDelete(id);
      return { deleted: true };
    }

    // Teacher chỉ được xóa bài của chính họ
    if (role === "teacher") {
      if (assessment.createdBy.toString() !== userId.toString()) {
        return { deleted: false, reason: "not_owner" };
      }

      await Assessment.findByIdAndDelete(id);
      return { deleted: true };
    }

    return { deleted: false, reason: "forbidden" };
  }
}

export const assessmentService = new AssessmentService();
