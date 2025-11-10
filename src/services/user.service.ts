import User, { IUser } from "../models/user.model";

interface IUserUpdate {
  name?: string;
  email?: string;
  password?: string;
  role?: "student" | "teacher" | "admin";
}

export class UserService {
  // Lấy tất cả user
  async getAllUsers(): Promise<IUser[]> {
    return User.find().select("-password").lean().exec();
  }

  // Lấy user theo id
  async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id).select("-password").lean().exec();
  }

  // Cập nhật user
  async updateUser(id: string, updates: IUserUpdate): Promise<IUser | null> {
    if (updates.password) {
      const bcrypt = require("bcrypt");
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password").lean().exec();
    return user;
  }

  // Xóa user
  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await User.findByIdAndDelete(id).lean().exec();
    if (!user) throw new Error("User không tồn tại");
    return { message: "User đã bị xóa" };
  }

   // Lấy profile của chính user
  async getProfile(userId: string): Promise<IUser | null> {
    return User.findById(userId).select("-password").lean().exec();
  }

  // Cập nhật profile của chính user (không cho sửa role)
  async updateProfile(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    const { role, ...restUpdates } = updates; // loại bỏ role nếu có

    if (restUpdates.password) {
      const bcrypt = require("bcrypt");
      restUpdates.password = await bcrypt.hash(restUpdates.password, 10);
    }

    const user = await User.findByIdAndUpdate(userId, restUpdates, { new: true }).select("-password").lean().exec();
    return user;
  }
}
