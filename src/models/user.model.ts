import mongoose, { Document, Schema, Model } from "mongoose";

export interface RefreshTokenSession {
  tokenHash: string; // SHA-256 hashed refresh token
  deviceId: string; // unique device identifier
  deviceName?: string; // e.g., "Chrome on Windows", "Safari on iPhone"
  ipAddress?: string; // IP address của request
  issuedAt: Date; // khi token được cấp
  expiresAt: Date; // khi token hết hạn (7 ngày)
  lastUsedAt?: Date; // lần cuối dùng token này
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  refreshSessions: RefreshTokenSession[]; // thay vì refreshTokens array
}

interface IUserModel extends Model<IUser> {}

const RefreshTokenSessionSchema = new Schema<RefreshTokenSession>({
  tokenHash: { type: String, required: true },
  deviceId: { type: String, required: true },
  deviceName: { type: String },
  ipAddress: { type: String },
  issuedAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
  lastUsedAt: { type: Date },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
    refreshSessions: {
      type: [RefreshTokenSessionSchema],
      default: [],
      // giới hạn tối đa 10 active sessions per user
      validate: {
        validator: function (v: RefreshTokenSession[]) {
          return v.length <= 10;
        },
        message: "Maximum 10 active sessions allowed per user",
      },
    },
  },
  { timestamps: true }
);

// Auto cleanup expired sessions trước khi save
UserSchema.pre("save", function (next) {
  const now = new Date();
  this.refreshSessions = this.refreshSessions.filter((session) => session.expiresAt > now);
  next();
});

export default mongoose.model<IUser, IUserModel>("User", UserSchema);
