import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }

    interface Response {
      apiSuccess?: <T = any>(data: T, message?: string, code?: number) => express.Response;
      apiError?: (problem?: any) => express.Response;
    }
  }
}

export {};
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}
