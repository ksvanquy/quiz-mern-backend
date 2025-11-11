import jwt, { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: "student" | "teacher" | "admin";
}

/**
 * Verify JWT token và trả về payload
 * @param token - JWT token string
 * @param secret - Secret key để verify
 * @returns Token payload nếu hợp lệ
 * @throws Error nếu token không hợp lệ
 */
export const verifyToken = (token: string, secret: string): TokenPayload => {
  try {
    const payload = jwt.verify(token, secret) as TokenPayload;
    return payload;
  } catch (error: any) {
    throw new Error(`Token verify error: ${error.message}`);
  }
};

/**
 * Extract Bearer token từ Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string hoặc null
 */
export const extractBearerToken = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

/**
 * Verify Access Token (dùng trong middleware)
 * @param token - Access token
 * @param accessTokenSecret - Access token secret
 * @returns Token payload
 */
export const verifyAccessToken = (token: string, accessTokenSecret: string): TokenPayload => {
  return verifyToken(token, accessTokenSecret);
};

/**
 * Verify Refresh Token (dùng trong auth service)
 * @param token - Refresh token
 * @param refreshTokenSecret - Refresh token secret
 * @returns Token payload
 */
export const verifyRefreshToken = (token: string, refreshTokenSecret: string): TokenPayload => {
  return verifyToken(token, refreshTokenSecret);
};
