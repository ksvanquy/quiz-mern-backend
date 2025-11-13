"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const answer_controller_1 = require("../controllers/answer.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin", "teacher"]), answer_controller_1.answerController.create);
router.get("/", answer_controller_1.answerController.getAll);
router.get("/:id", answer_controller_1.answerController.getById);
router.put("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin", "teacher"]), answer_controller_1.answerController.update);
router.delete("/:id", auth_middleware_1.authenticate, answer_controller_1.answerController.delete); // check owner trong controller/service
exports.default = router;
