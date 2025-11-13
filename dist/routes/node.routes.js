"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const node_controller_1 = require("../controllers/node.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
const controller = new node_controller_1.NodeController();
/**
 * @swagger
 * /nodes:
 *   post:
 *     summary: Create node (Admin/Teacher only)
 *     description: Create a new learning node/topic
 *     tags:
 *       - Nodes
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Node created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/teacher only
 *       500:
 *         description: Server error
 */
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin", "teacher"]), controller.createNode);
/**
 * @swagger
 * /nodes:
 *   get:
 *     summary: Get all nodes
 *     description: Retrieve list of all nodes (public endpoint)
 *     tags:
 *       - Nodes
 *     responses:
 *       200:
 *         description: Nodes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.get("/", controller.getAllNodes);
/**
 * @swagger
 * /nodes/{id}:
 *   get:
 *     summary: Get node by ID
 *     tags:
 *       - Nodes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Node retrieved successfully
 *       404:
 *         description: Node not found
 *       500:
 *         description: Server error
 */
router.get("/:id", controller.getNodeById);
/**
 * @swagger
 * /nodes/{id}:
 *   put:
 *     summary: Update node (Admin/Teacher only)
 *     tags:
 *       - Nodes
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Node updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/teacher only
 *       404:
 *         description: Node not found
 *       500:
 *         description: Server error
 */
router.put("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin", "teacher"]), controller.updateNode);
/**
 * @swagger
 * /nodes/{id}:
 *   delete:
 *     summary: Delete node (Admin only)
 *     tags:
 *       - Nodes
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Node deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin only
 *       404:
 *         description: Node not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(["admin"]), controller.deleteNode);
exports.default = router;
