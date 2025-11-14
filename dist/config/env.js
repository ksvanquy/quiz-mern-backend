"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySecretsLoaded = exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_SECRET = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 5000;
exports.MONGO_URI = process.env.MONGO_URI || '';
exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
exports.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';
/**
 * Verify that all required environment secrets are properly configured
 * Should be called at server startup
 */
const verifySecretsLoaded = () => {
    const missingSecrets = [];
    if (!process.env.ACCESS_TOKEN_SECRET) {
        missingSecrets.push('ACCESS_TOKEN_SECRET');
    }
    if (!process.env.REFRESH_TOKEN_SECRET) {
        missingSecrets.push('REFRESH_TOKEN_SECRET');
    }
    if (missingSecrets.length > 0) {
        throw new Error(`🔐 CRITICAL: Missing required environment secrets: ${missingSecrets.join(', ')}\n` +
            `Please set these in your .env file with strong random values.`);
    }
    // Warn if secrets appear to be placeholder/weak values
    if (process.env.ACCESS_TOKEN_SECRET?.includes('your_') ||
        process.env.REFRESH_TOKEN_SECRET?.includes('your_') ||
        process.env.ACCESS_TOKEN_SECRET?.length < 32 ||
        process.env.REFRESH_TOKEN_SECRET?.length < 32) {
        console.warn('⚠️  WARNING: JWT secrets appear to be weak or placeholder values.\n' +
            '   For production, use strong random values (min 32 characters).\n' +
            '   Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    }
};
exports.verifySecretsLoaded = verifySecretsLoaded;
