import User, { IUser, RefreshTokenSession } from "../models/user.model";
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

// Constants
const MAX_SESSIONS_PER_USER = 10;
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate device ID from user agent and IP (simplified device fingerprint)
 * In production, use a more sophisticated approach or let client generate & send it
 */
const generateDeviceId = (userAgent?: string, ipAddress?: string): string => {
  const data = `${userAgent || 'unknown'}:${ipAddress || 'unknown'}`;
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
};

export class AuthService {

  // Register user bình thường (role luôn là student)
  async register(name: string, email: string, password: string): Promise<UserSafe> {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email đã tồn tại");

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword, role: "student" });
    await user.save();

    const { password: _pwd, refreshSessions, ...userData } = user.toObject();
    return userData as UserSafe;
  }

  // Admin tạo user với role tùy ý
  async createUserByAdmin(name: string, email: string, password: string, role: "student" | "teacher" | "admin"): Promise<UserSafe> {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email đã tồn tại");

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const { password: _pwd, refreshSessions, ...userData } = user.toObject();
    return userData as UserSafe;
  }

  // Login + trả access + refresh token (tạo session mới)
  async login(
    email: string,
    password: string,
    userAgent?: string,
    ipAddress?: string,
    deviceName?: string
  ): Promise<{ accessToken: string; refreshToken: string; user: UserSafe }> {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Sai mật khẩu");

    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });

    // Tạo device ID
    const deviceId = generateDeviceId(userAgent, ipAddress);

    // Hash refresh token
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Tạo session mới
    const newSession: RefreshTokenSession = {
      tokenHash,
      deviceId,
      deviceName: deviceName || userAgent?.substring(0, 50) || 'Unknown Device',
      ipAddress,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS),
    };

    // Nếu đạt MAX_SESSIONS, xoá session cũ nhất (FIFO)
    if (user.refreshSessions.length >= MAX_SESSIONS_PER_USER) {
      user.refreshSessions.sort((a, b) => a.issuedAt.getTime() - b.issuedAt.getTime());
      user.refreshSessions.shift(); // remove oldest
    }

    // Thêm session mới
    user.refreshSessions.push(newSession);
    await user.save();

    const { password: _pwd, refreshSessions, ...userData } = user.toObject();
    return { accessToken, refreshToken, user: userData as UserSafe };
  }

  // Refresh token (token rotation + update lastUsedAt)
  async refreshToken(
    oldRefreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: any;

    try {
      payload = verifyRefreshToken(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret");
    } catch {
      throw new Error("Refresh token không hợp lệ hoặc hết hạn");
    }

    const user = await User.findById(payload.userId);
    if (!user) throw new Error("User không tồn tại");

    // Tìm session hiện tại bằng token hash
    const oldTokenHash = crypto.createHash('sha256').update(oldRefreshToken).digest('hex');
    const sessionIndex = user.refreshSessions.findIndex((s) => s.tokenHash === oldTokenHash);

    if (sessionIndex === -1) {
      throw new Error("Refresh token đã bị revoke hoặc không tồn tại");
    }

    const session = user.refreshSessions[sessionIndex];

    // Kiểm tra token còn hạn không
    if (session.expiresAt < new Date()) {
      user.refreshSessions.splice(sessionIndex, 1);
      await user.save();
      throw new Error("Refresh token hết hạn");
    }

    // Cấp token mới
    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id, role: user.role });

    // Rotate: xoá token cũ và thêm token mới (cùng device)
    const newTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const updatedSession: RefreshTokenSession = {
      ...session,
      tokenHash: newTokenHash,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS),
      lastUsedAt: new Date(),
    };

    user.refreshSessions[sessionIndex] = updatedSession;
    await user.save();

    return { accessToken, refreshToken };
  }

  // Logout (xoá session cụ thể)
  async logout(refreshToken: string): Promise<void> {
    const payload: any = require("jsonwebtoken").decode(refreshToken);
    if (!payload) return;

    const user = await User.findById(payload.userId);
    if (!user) return;

    // Xoá session bằng token hash
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    user.refreshSessions = user.refreshSessions.filter((s) => s.tokenHash !== tokenHash);
    await user.save();
  }

  /**
   * Logout từ tất cả devices (logout all sessions)
   */
  async logoutAll(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) return;

    user.refreshSessions = [];
    await user.save();
  }

  /**
   * Logout từ device cụ thể (bằng deviceId)
   */
  async logoutDevice(userId: string, deviceId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) return;

    user.refreshSessions = user.refreshSessions.filter((s) => s.deviceId !== deviceId);
    await user.save();
  }

  /**
   * Lấy danh sách tất cả active sessions của user
   */
  async getActiveSessions(userId: string): Promise<Array<Omit<RefreshTokenSession, 'tokenHash'>>> {
    const user = await User.findById(userId);
    if (!user) return [];

    const now = new Date();
    // Lọc session còn hạn và ẩn tokenHash
    return user.refreshSessions
      .filter((s) => s.expiresAt > now)
      .map(({ tokenHash, ...session }) => session);
  }
}
