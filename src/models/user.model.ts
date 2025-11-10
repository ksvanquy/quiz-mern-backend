import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  refreshTokens: string[]; // lưu refresh token
}

interface IUserModel extends Model<IUser> {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
    refreshTokens: { type: [String], default: [] }, // array lưu refresh token
  },
  { timestamps: true }
);

export default mongoose.model<IUser, IUserModel>("User", UserSchema);
