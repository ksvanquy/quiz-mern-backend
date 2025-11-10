import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// 📌 Mở rộng interface Request để có req.user
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

// ✅ Middleware xác thực JWT
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    const token = authHeader.split(" ")[1];

    // Giải mã token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Lấy user từ DB, loại trừ password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User không tồn tại" });
    }

    req.user = user; // gắn user vào req
    next();

  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// ✅ Middleware phân quyền theo role
export const authorize = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    next();
  };
};
