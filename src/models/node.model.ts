import { Schema, model, Document, Types } from "mongoose";

export interface INode extends Document {
  name: string;
  type: "category" | "subcategory" | "topic";
  parentId?: Types.ObjectId | null;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId | null;
}

const nodeSchema = new Schema<INode>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["category", "subcategory", "topic"], required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Node", default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

// Unique index: tên node phải duy nhất trong cùng một parent
nodeSchema.index({ name: 1, parentId: 1 }, { unique: true });

export default model<INode>("Node", nodeSchema);
