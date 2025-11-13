"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_SECRET = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 5000;
exports.MONGO_URI = process.env.MONGO_URI || '';
exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret';
exports.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';
