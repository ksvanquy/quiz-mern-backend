import { Schema, model, Document, Types } from "mongoose";

export interface IQuestion extends Document {
  text: string;
  assessmentId: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId | null;
}

const questionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: "Assessment", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default model<IQuestion>("Question", questionSchema);
