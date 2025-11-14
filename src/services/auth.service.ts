import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens";
import { verifyRefreshToken } from "../utils/verifyToken";
import crypto from 'crypto';

export type UserSafe = {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
};

export class AuthService {

  // Register user bình thường (role luôn là student)
  async register(name: string, email: string, password: string): Promise<UserSafe> {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email đã tồn tại");

    const hashedPassword = await bcrypt.hash(password, 12); // Increased from 10 to 12 for better security
    const user = new User({ name, email, password: hashedPassword, role: "student" });
    await user.save();

    const { password: _pwd, ...userData } = user.toObject();
    return userData as UserSafe;
  }

  // Admin tạo user với role tùy ý
  async createUserByAdmin(name: string, email: string, password: string, role: "student" | "teacher" | "admin"): Promise<UserSafe> {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email đã tồn tại");

    const hashedPassword = await bcrypt.hash(password, 12); // Increased from 10 to 12 for better security
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const { password: _pwd, ...userData } = user.toObject();
    return userData as UserSafe;
  }

   // Login + trả access + refresh token
  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: UserSafe }> {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Sai mật khẩu");

    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });

    // Hash the refresh token before saving to DB to avoid storing raw tokens
    const hashed = crypto.createHash('sha256').update(refreshToken).digest('hex');
    user.refreshTokens.push(hashed);
    await user.save();

    const { password: _pwd, refreshTokens, ...userData } = user.toObject();
    return { accessToken, refreshToken, user: userData as UserSafe };
  }

  // Refresh token
  async refreshToken(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: any;

    try {
      payload = verifyRefreshToken(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret");
    } catch {
      throw new Error("Refresh token không hợp lệ hoặc hết hạn");
    }

    const user = await User.findById(payload.userId);
    if (!user) throw new Error("User không tồn tại");

    // Kiểm tra token có còn trong DB không (compare hashed value)
    const oldHash = crypto.createHash('sha256').update(oldRefreshToken).digest('hex');
    if (!user.refreshTokens.includes(oldHash)) throw new Error("Refresh token đã bị revoke");

    // Tạo token mới
    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });

    // Xoá token cũ (hashed) và thêm token mới (hashed)
    user.refreshTokens = user.refreshTokens.filter(t => t !== oldHash);
    const newHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    user.refreshTokens.push(newHash);
    await user.save();

    return { accessToken, refreshToken };
  }

  // Logout
  async logout(refreshToken: string) {
    const payload: any = require("jsonwebtoken").decode(refreshToken);
    if (!payload) return;

    const user = await User.findById(payload.userId);
    if (!user) return;

    // Remove hashed version of the token
    const hashed = crypto.createHash('sha256').update(refreshToken).digest('hex');
    user.refreshTokens = user.refreshTokens.filter(t => t !== hashed);
    await user.save();
  }
}
