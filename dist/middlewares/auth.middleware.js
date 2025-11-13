"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const env_1 = require("../config/env");
const verifyToken_1 = require("../utils/verifyToken");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (0, verifyToken_1.extractBearerToken)(authHeader);
    if (!token) {
        console.log("No Authorization header or invalid Bearer format");
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        console.log("Token received:", token);
        console.log("Using secret:", env_1.ACCESS_TOKEN_SECRET);
        const payload = (0, verifyToken_1.verifyAccessToken)(token, env_1.ACCESS_TOKEN_SECRET);
        console.log("Payload:", payload);
        req.user = payload;
        next();
    }
    catch (err) {
        console.error("JWT verify error:", err.message);
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};
exports.authenticate = authenticate;
