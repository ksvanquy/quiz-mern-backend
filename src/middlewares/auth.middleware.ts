import { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN_SECRET } from "../config/env";
import { verifyAccessToken, extractBearerToken } from "../utils/verifyToken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  const token = extractBearerToken(authHeader);
  if (!token) {
    console.log("[AUTH] Missing or invalid Authorization header");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = verifyAccessToken(token, ACCESS_TOKEN_SECRET);
    
    // Log only non-sensitive info
    console.log("[AUTH] Token verified successfully for user:", payload.userId);

    req.user = payload;
    next();
  } catch (err: any) {
    console.error("[AUTH] Token verification failed:", err.message);
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};
