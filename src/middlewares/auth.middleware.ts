import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/env";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No Authorization header");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    console.log("Token received:", token);
    console.log("Using secret:", ACCESS_TOKEN_SECRET);

    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string; role: string };
    console.log("Payload:", payload);

    req.user = payload;
    next();
  } catch (err: any) {
    console.error("JWT verify error:", err);
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};
