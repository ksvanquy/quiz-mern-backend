import { Request, Response } from "express";
import { NodeService } from "../services/node.service";

export class NodeController {
  private nodeService = new NodeService();

  createNode = async (req: Request, res: Response) => {
    try {
      const payload = { ...req.body };

      if (req.user?.userId) {
        payload.createdBy = req.user.userId;
      }

      const node = await this.nodeService.createNode(payload);
      return res.status(201).json(node);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };

  getAllNodes = async (req: Request, res: Response) => {
    try {
      const nodes = await this.nodeService.getAllNodes();
      return res.json(nodes);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };

  getNodeById = async (req: Request, res: Response) => {
    try {
      const node = await this.nodeService.getNodeById(req.params.id);
      if (!node) return res.status(404).json({ error: "Node not found" });
      return res.json(node);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };

  updateNode = async (req: Request, res: Response) => {
    try {
      const updates = { ...req.body };

      if (req.user?.userId) {
        updates.updatedBy = req.user.userId;
      }

      const node = await this.nodeService.updateNode(req.params.id, updates);
      return res.json(node);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };

  deleteNode = async (req: Request, res: Response) => {
    try {
      await this.nodeService.deleteNode(req.params.id);
      return res.json({ message: "Node deleted" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };
}
