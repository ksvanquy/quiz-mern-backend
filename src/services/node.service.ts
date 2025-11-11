import Node, { INode } from "../models/node.model";
import { Types } from "mongoose";

export class NodeService {
  // Tạo node, xử lý duplicate
  async createNode(payload: Partial<INode>): Promise<INode> {
    try {
      const node = await Node.create(payload);
      return node;
    } catch (err: any) {
      // Duplicate key error
      if (err.code === 11000) {
        throw new Error("Node đã tồn tại trong parent này");
      }
      throw err;
    }
  }

  // Lấy tất cả node
  async getAllNodes(): Promise<INode[]> {
    return Node.find();
  }

  // Lấy node theo ID
  async getNodeById(id: string): Promise<INode | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Node.findById(id);
  }

  // Cập nhật node, kiểm tra duplicate
  async updateNode(id: string, updates: Partial<INode>): Promise<INode | null> {
    try {
      if (!Types.ObjectId.isValid(id)) return null;
      const node = await Node.findByIdAndUpdate(id, updates, { new: true });
      return node;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new Error("Node đã tồn tại trong parent này");
      }
      throw err;
    }
  }

  // Xóa node theo ID
  async deleteNode(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) return;
    await Node.findByIdAndDelete(id);
  }
}
