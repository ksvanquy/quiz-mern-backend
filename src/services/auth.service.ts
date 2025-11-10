import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
// import { generateTokens } from "../utils/generateTokens";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens";
import jwt from "jsonwebtoken";
// import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/env";

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: "student" });
    await user.save();

    const { password: _pwd, ...userData } = user.toObject();
    return userData as UserSafe;
  }

  // Admin tạo user với role tùy ý
  async createUserByAdmin(name: string, email: string, password: string, role: "student" | "teacher" | "admin"): Promise<UserSafe> {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email đã tồn tại");

    const hashedPassword = await bcrypt.hash(password, 10); // hash password
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

    // Lưu refresh token vào DB
    user.refreshTokens.push(refreshToken);
    await user.save();

    const { password: _pwd, refreshTokens, ...userData } = user.toObject();
    return { accessToken, refreshToken, user: userData as UserSafe };
  }

  // Refresh token
  async refreshToken(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const jwt = require("jsonwebtoken");
    let payload: any;

    try {
      payload = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret");
    } catch {
      throw new Error("Refresh token không hợp lệ hoặc hết hạn");
    }

    const user = await User.findById(payload.userId);
    if (!user) throw new Error("User không tồn tại");

    // Kiểm tra token có còn trong DB không
    if (!user.refreshTokens.includes(oldRefreshToken)) throw new Error("Refresh token đã bị revoke");

    // Tạo token mới
    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });

    // Xoá token cũ và thêm token mới (rotate token)
    user.refreshTokens = user.refreshTokens.filter(t => t !== oldRefreshToken);
    user.refreshTokens.push(refreshToken);
    await user.save();

    return { accessToken, refreshToken };
  }

  // Logout
  async logout(refreshToken: string) {
    const payload: any = require("jsonwebtoken").decode(refreshToken);
    if (!payload) return;

    const user = await User.findById(payload.userId);
    if (!user) return;

    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    await user.save();
  }
}
