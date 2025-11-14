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
      return res.apiSuccess?.(node, 'Node created successfully', 201);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/create', title: 'Create Error', status: 400, detail: err.message });
    }
  };

  getAllNodes = async (req: Request, res: Response) => {
    try {
      const nodes = await this.nodeService.getAllNodes();
      return res.apiSuccess?.(nodes, 'Nodes retrieved successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  };

  getNodeById = async (req: Request, res: Response) => {
    try {
      const node = await this.nodeService.getNodeById(req.params.id);
      if (!node) return res.apiError?.({ type: '/errors/not_found', title: 'Not Found', status: 404, detail: 'Node not found' });
      return res.apiSuccess?.(node, 'Node retrieved successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/server', title: 'Server Error', status: 500, detail: err.message });
    }
  };

  updateNode = async (req: Request, res: Response) => {
    try {
      const updates = { ...req.body };

      if (req.user?.userId) {
        updates.updatedBy = req.user.userId;
      }

      const node = await this.nodeService.updateNode(req.params.id, updates);
      return res.apiSuccess?.(node, 'Node updated successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/update', title: 'Update Error', status: 400, detail: err.message });
    }
  };

  deleteNode = async (req: Request, res: Response) => {
    try {
      await this.nodeService.deleteNode(req.params.id);
      return res.apiSuccess?.(null, 'Node deleted successfully', 200);
    } catch (err: any) {
      return res.apiError?.({ type: '/errors/delete', title: 'Delete Error', status: 500, detail: err.message });
    }
  };
}
