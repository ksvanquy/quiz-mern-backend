import { Schema, model, Document, Types } from "mongoose";

export interface IAnswer extends Document {
  text: string;
  isCorrect: boolean;
  questionId: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId | null;
}

const answerSchema = new Schema<IAnswer>(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default model<IAnswer>("Answer", answerSchema);
