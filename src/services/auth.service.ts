import User from "../models/user.model";
import { generateToken } from "../utils/generateTokens";

export class AuthService {

    // Register user bình thường
  async register(name: string, email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email đã tồn tại");
    }

    // Luôn mặc định role là student
    const user = new User({ name, email, password, role: "student" });
    await user.save();

    return user;
  }

  // Chỉ admin mới có quyền tạo user với role tùy ý
  async createUserByAdmin(name: string, email: string, password: string, role: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email đã tồn tại");
    }

    const user = new User({ name, email, password, role });
    await user.save();

    return user;
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user) throw new Error("Email không tồn tại");

    const isMatch = await user.comparePassword(password);

    if (!isMatch) throw new Error("Sai mật khẩu");

    const token = generateToken({ userId: user._id, role: user.role });

    return { token, user };
  }
}
