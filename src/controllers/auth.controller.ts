import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      const user = await authService.register(name, email, password, role);

      res.status(201).json({
        message: "Đăng ký thành công",
        userId: user._id,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const { token } = await authService.login(email, password);

      res.json({
        message: "Đăng nhập thành công",
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
