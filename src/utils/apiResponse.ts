/**
 * Enterprise API response utilities
 * - RFC 7807 compatible problem details embedded in `error`
 * - Envelope contains requestId, path, timestamp, version
 * - Provides helpers and an Express middleware to attach `res.apiSuccess` and `res.apiError`
 */

import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

// API version - fallback to 1.0.0 if package version not available
export const API_VERSION = process.env.npm_package_version || '1.0.0';

export type ErrorDetail = {
  field?: string;
  message: string;
  code?: string;
};

/**
 * RFC 7807 style problem details, extended for enterprise needs
 */
export interface ApiProblemDetails {
  type: string; // URI identifier for the error class
  title: string; // short human-readable summary
  status: number; // HTTP status code
  detail?: string; // detailed human-readable explanation
  instance?: string; // request path or unique instance URI
  errors?: ErrorDetail[]; // field-level errors
}

/**
 * Standard envelope used for all responses
 */
export interface ApiEnvelope<T = any> {
  success: boolean;
  code: number; // HTTP status code
  message?: string; // short message
  data?: T;
  error?: ApiProblemDetails;

  requestId: string;
  path: string;
  timestamp: string;
  version: string;
}

/**
 * Generate a strong request id. Use crypto.randomUUID where available.
 */
export const generateRequestId = (): string => {
  try {
    return randomUUID();
  } catch {
    // fallback (very unlikely in modern Node versions)
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
};

/**
 * Create a success envelope
 */
export const successResponse = <T = any>(
  data: T,
  message: string = 'Success',
  code: number = 200,
  opts?: { requestId?: string; path?: string }
): ApiEnvelope<T> => {
  const requestId = opts?.requestId || generateRequestId();
  const path = opts?.path || '/';
  return {
    success: true,
    code,
    message,
    data,
    requestId,
    path,
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  };
};

/**
 * Create a problem-envelope (RFC 7807 compatible)
 */
export const problemResponse = (
  problem: Partial<ApiProblemDetails> & { status?: number },
  opts?: { requestId?: string; path?: string }
): ApiEnvelope => {
  const status = problem.status || 500;
  const requestId = opts?.requestId || generateRequestId();
  const path = opts?.path || (problem.instance || '/');

  const details: ApiProblemDetails = {
    type: problem.type || 'about:blank',
    title: problem.title || 'Error',
    status,
    detail: problem.detail,
    instance: problem.instance || path,
    errors: problem.errors,
  };

  return {
    success: false,
    code: status,
    message: details.title,
    error: details,
    requestId,
    path,
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  };
};

/**
 * Common problem helpers
 */
export const validationErrorResponse = (
  instance: string,
  errors: ErrorDetail[],
  detail: string = 'One or more fields are invalid.'
): ApiEnvelope =>
  problemResponse({
    type: '/errors/validation',
    title: 'Validation Error',
    status: 400,
    detail,
    instance,
    errors,
  });

export const authenticationErrorResponse = (
  instance: string,
  detail: string = 'Authentication failed'
): ApiEnvelope =>
  problemResponse({
    type: '/errors/auth',
    title: 'Authentication Error',
    status: 401,
    detail,
    instance,
  });

export const forbiddenResponse = (instance: string, detail = 'Forbidden') =>
  problemResponse({
    type: '/errors/forbidden',
    title: 'Forbidden',
    status: 403,
    detail,
    instance,
  });

export const notFoundResponse = (instance: string, detail = 'Not Found') =>
  problemResponse({
    type: '/errors/not_found',
    title: 'Not Found',
    status: 404,
    detail,
    instance,
  });

/**
 * Express middleware to attach requestId and helper methods to `res`.
 * Usage: app.use(apiResponseMiddleware())
 * Adds:
 *  - req.requestId (string)
 *  - res.apiSuccess(data, message?, code?) -> sends success envelope
 *  - res.apiError(problem) -> sends problem envelope
 */
export const apiResponseMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const incomingRequestId =
      (req.headers['x-request-id'] as string) || (req.headers['x-correlation-id'] as string);
    const requestId = incomingRequestId || generateRequestId();
    // attach to req for downstream usage
    (req as any).requestId = requestId;

    // helper to send success
    (res as any).apiSuccess = (data: any, message = 'Success', code = 200) => {
      const envelope = successResponse(data, message, code, {
        requestId,
        path: req.originalUrl || req.url,
      });
      return res.status(code).json(envelope);
    };

    // helper to send problem/error
    (res as any).apiError = (
      problem: Partial<ApiProblemDetails> & { status?: number } = { title: 'Error', status: 500 }
    ) => {
      const envelope = problemResponse(problem, {
        requestId,
        path: req.originalUrl || req.url,
      });
      return res.status(envelope.code).json(envelope);
    };

    return next();
  };
};
