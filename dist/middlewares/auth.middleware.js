"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const env_1 = require("../config/env");
const verifyToken_1 = require("../utils/verifyToken");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (0, verifyToken_1.extractBearerToken)(authHeader);
    if (!token) {
        console.log("[AUTH] Missing or invalid Authorization header");
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const payload = (0, verifyToken_1.verifyAccessToken)(token, env_1.ACCESS_TOKEN_SECRET);
        // Log only non-sensitive info
        console.log("[AUTH] Token verified successfully for user:", payload.userId);
        req.user = payload;
        next();
    }
    catch (err) {
        console.error("[AUTH] Token verification failed:", err.message);
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};
exports.authenticate = authenticate;
