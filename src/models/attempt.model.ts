import { Schema, model, Document, Types } from "mongoose";

export interface IAttemptAnswer {
  questionId: Types.ObjectId;
  answerId: Types.ObjectId;
  isCorrect: boolean;
}

export interface IAttempt extends Document {
  userId: Types.ObjectId;
  assessmentId: Types.ObjectId;
  startedAt: Date;
  finishedAt?: Date;
  totalScore: number;
  answers: IAttemptAnswer[];
}

const attemptAnswerSchema = new Schema<IAttemptAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    answerId: { type: Schema.Types.ObjectId, ref: "Answer", required: true },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: false }
);

const attemptSchema = new Schema<IAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: "Assessment", required: true },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
    totalScore: { type: Number, default: 0 },
    answers: [attemptAnswerSchema],
  },
  { timestamps: true }
);

export default model<IAttempt>("Attempt", attemptSchema);
