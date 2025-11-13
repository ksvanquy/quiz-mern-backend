"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const node_routes_1 = __importDefault(require("./node.routes"));
const assessment_routes_1 = __importDefault(require("./assessment.routes"));
const question_routes_1 = __importDefault(require("./question.routes"));
const answer_routes_1 = __importDefault(require("./answer.routes"));
const attempt_routes_1 = __importDefault(require("./attempt.routes"));
const lazy_routes_1 = __importDefault(require("./lazy.routes"));
const router = (0, express_1.Router)();
// ✅ Gom tất cả route modules với prefix thống nhất
router.use("/auth", auth_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/nodes", node_routes_1.default);
router.use("/assessments", assessment_routes_1.default);
router.use("/questions", question_routes_1.default);
router.use("/answers", answer_routes_1.default);
router.use("/attempts", attempt_routes_1.default);
router.use("/lazy", lazy_routes_1.default);
exports.default = router;
