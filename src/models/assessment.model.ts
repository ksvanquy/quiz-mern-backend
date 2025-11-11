import { Schema, model, Document, Types } from "mongoose";

export interface IAssessment extends Document {
  title: string;
  type: "quiz" | "exam" | "test";
  nodeId: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

const assessmentSchema = new Schema<IAssessment>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["quiz", "exam", "test"], required: true },
    nodeId: { type: Schema.Types.ObjectId, ref: "Node", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

export default model<IAssessment>("Assessment", assessmentSchema);
