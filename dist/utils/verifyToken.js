"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.extractBearerToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Verify JWT token và trả về payload
 * @param token - JWT token string
 * @param secret - Secret key để verify
 * @returns Token payload nếu hợp lệ
 * @throws Error nếu token không hợp lệ
 */
const verifyToken = (token, secret) => {
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        return payload;
    }
    catch (error) {
        throw new Error(`Token verify error: ${error.message}`);
    }
};
exports.verifyToken = verifyToken;
/**
 * Extract Bearer token từ Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string hoặc null
 */
const extractBearerToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    return authHeader.split(" ")[1];
};
exports.extractBearerToken = extractBearerToken;
/**
 * Verify Access Token (dùng trong middleware)
 * @param token - Access token
 * @param accessTokenSecret - Access token secret
 * @returns Token payload
 */
const verifyAccessToken = (token, accessTokenSecret) => {
    return (0, exports.verifyToken)(token, accessTokenSecret);
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * Verify Refresh Token (dùng trong auth service)
 * @param token - Refresh token
 * @param refreshTokenSecret - Refresh token secret
 * @returns Token payload
 */
const verifyRefreshToken = (token, refreshTokenSecret) => {
    return (0, exports.verifyToken)(token, refreshTokenSecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
