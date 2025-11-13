"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assessment_controller_1 = require("../controllers/assessment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
/* CREATE Assessment */
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin", "teacher"]), assessment_controller_1.assessmentController.create);
/* GET All */
router.get("/", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin", "teacher"]), assessment_controller_1.assessmentController.getAll);
/* GET by ID */
router.get("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin", "teacher"]), assessment_controller_1.assessmentController.getById);
/* UPDATE */
router.put("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin", "teacher"]), assessment_controller_1.assessmentController.update);
/* DELETE – ONLY admin */
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin", "teacher"]), assessment_controller_1.assessmentController.delete);
exports.default = router;
