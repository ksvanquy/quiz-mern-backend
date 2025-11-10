import { Request, Response } from "express";
import { AuthService, UserSafe } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {

  // Register bình thường (role luôn student)
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body; // ignore role từ client
      const user: UserSafe = await authService.register(name, email, password);

      res.status(201).json({
        message: "Đăng ký thành công",
        userId: user._id,
        user, // trả về thông tin user safe
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Admin tạo user với role tùy ý
  async createUserByAdmin(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      // TODO: Kiểm tra quyền admin trước khi cho tạo
      const user: UserSafe = await authService.createUserByAdmin(name, email, password, role);

      res.status(201).json({
        message: "Tạo user thành công",
        userId: user._id,
        user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({ message: "Đăng nhập thành công", ...result });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);
      res.json(tokens);
    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      res.json({ message: "Đã logout" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
