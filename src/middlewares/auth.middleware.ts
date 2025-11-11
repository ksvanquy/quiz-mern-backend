import { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN_SECRET } from "../config/env";
import { verifyAccessToken, extractBearerToken } from "../utils/verifyToken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  const token = extractBearerToken(authHeader);
  if (!token) {
    console.log("No Authorization header or invalid Bearer format");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.log("Token received:", token);
    console.log("Using secret:", ACCESS_TOKEN_SECRET);

    const payload = verifyAccessToken(token, ACCESS_TOKEN_SECRET);
    console.log("Payload:", payload);

    req.user = payload;
    next();
  } catch (err: any) {
    console.error("JWT verify error:", err.message);
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};
