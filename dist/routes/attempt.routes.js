"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attempt_controller_1 = require("../controllers/attempt.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Tất cả route đều cần login
router.use(auth_middleware_1.authenticate);
router.post("/", attempt_controller_1.attemptController.create);
router.get("/", attempt_controller_1.attemptController.getAll);
router.get("/:id", attempt_controller_1.attemptController.getById);
router.put("/:id", attempt_controller_1.attemptController.update);
router.delete("/:id", attempt_controller_1.attemptController.delete); // chỉ admin
exports.default = router;
