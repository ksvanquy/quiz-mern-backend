"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/env";
// export const generateTokens = (payload: { userId: string; role: string }) => {
//   const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
//   const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
//   return { accessToken, refreshToken };
// };
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET || "your_access_token_secret", { expiresIn: "15m" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret", { expiresIn: "7d" });
};
exports.generateRefreshToken = generateRefreshToken;
