import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateTokens";

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

  // Login
  async login(email: string, password: string): Promise<{ token: string; user: UserSafe }> {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Sai mật khẩu");

    const token = generateToken({ userId: user._id, role: user.role });

    const { password: _pwd, ...userData } = user.toObject();
    return { token, user: userData as UserSafe };
  }
}
