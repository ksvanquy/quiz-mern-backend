"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeController = void 0;
const node_service_1 = require("../services/node.service");
class NodeController {
    constructor() {
        this.nodeService = new node_service_1.NodeService();
        this.createNode = async (req, res) => {
            try {
                const payload = { ...req.body };
                if (req.user?.userId) {
                    payload.createdBy = req.user.userId;
                }
                const node = await this.nodeService.createNode(payload);
                return res.status(201).json(node);
            }
            catch (err) {
                return res.status(400).json({ error: err.message });
            }
        };
        this.getAllNodes = async (req, res) => {
            try {
                const nodes = await this.nodeService.getAllNodes();
                return res.json(nodes);
            }
            catch (err) {
                return res.status(500).json({ error: err.message });
            }
        };
        this.getNodeById = async (req, res) => {
            try {
                const node = await this.nodeService.getNodeById(req.params.id);
                if (!node)
                    return res.status(404).json({ error: "Node not found" });
                return res.json(node);
            }
            catch (err) {
                return res.status(500).json({ error: err.message });
            }
        };
        this.updateNode = async (req, res) => {
            try {
                const updates = { ...req.body };
                if (req.user?.userId) {
                    updates.updatedBy = req.user.userId;
                }
                const node = await this.nodeService.updateNode(req.params.id, updates);
                return res.json(node);
            }
            catch (err) {
                return res.status(400).json({ error: err.message });
            }
        };
        this.deleteNode = async (req, res) => {
            try {
                await this.nodeService.deleteNode(req.params.id);
                return res.json({ message: "Node deleted" });
            }
            catch (err) {
                return res.status(500).json({ error: err.message });
            }
        };
    }
}
exports.NodeController = NodeController;
