"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const startServer = async () => {
    // Verify critical secrets are configured before starting
    (0, env_1.verifySecretsLoaded)();
    await (0, database_1.connectDB)(env_1.MONGO_URI);
    app_1.default.listen(env_1.PORT, () => {
        console.log(`Server running on port ${env_1.PORT}`);
    });
};
startServer();
