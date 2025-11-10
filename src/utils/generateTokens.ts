import jwt from "jsonwebtoken";
// import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/env";

// export const generateTokens = (payload: { userId: string; role: string }) => {
//   const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
//   const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

//   return { accessToken, refreshToken };
// };

export const generateAccessToken = (payload: { userId: string; role: string }) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || "your_access_token_secret", { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: { userId: string; role: string }) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret", { expiresIn: "7d" });
};