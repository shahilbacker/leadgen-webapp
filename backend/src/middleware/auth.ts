import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'devorae_super_secret_access_jwt_key_2026_change_in_prod';

/**
 * Middleware: Authenticate JWT Access Token
 * Checks the Authorization header for 'Bearer <token>'.
 * If valid, decodes the payload and attaches it to `req.user`.
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access Denied: Missing Bearer authorization token.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Access token has expired. Please refresh your session.',
      });
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Invalid or forged authentication token.',
    });
    return;
  }
};

/**
 * Middleware: Role-Based Access Control (RBAC) Guard
 * Restricts access to one or more permitted roles (e.g. ['admin'], or ['admin', 'viewer']).
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required before checking permissions.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' lacks sufficient privileges. Required: [${allowedRoles.join(', ')}].`,
      });
      return;
    }

    next();
  };
};
