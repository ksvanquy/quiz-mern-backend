"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_controller_1 = require("../controllers/question.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin", "teacher"]), question_controller_1.questionController.create);
router.get("/", question_controller_1.questionController.getAll);
router.get("/:id", question_controller_1.questionController.getById);
router.put("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin", "teacher"]), question_controller_1.questionController.update);
router.delete("/:id", auth_middleware_1.authenticate, question_controller_1.questionController.delete); // delete kiểm tra owner trong controller/service
exports.default = router;
