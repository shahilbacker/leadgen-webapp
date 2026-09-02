import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { userRepository } from '../models/User';
import { AuthenticatedRequest, TokenPayload } from '../middleware/auth';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'devorae_super_secret_access_jwt_key_2026_change_in_prod';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'devorae_super_secret_refresh_jwt_key_2026_change_in_prod';
const JWT_ACCESS_EXPIRES_IN = (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

/**
 * Controller: Handles Admin/Viewer Authentication
 */
export class AuthController {
  /**
   * POST /api/auth/login
   * Authenticates user credentials and issues access + refresh tokens
   */
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
      return;
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
      return;
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    // Issue short-lived access token and long-lived refresh token
    const accessToken = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    await userRepository.saveRefreshToken(user.id, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  }

  /**
   * POST /api/auth/refresh
   * Exchanges a valid refresh token for a new access token
   */
  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Missing refresh token.',
      });
      return;
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
      const user = await userRepository.findById(decoded.userId);

      if (!user) {
        res.status(401).json({ success: false, message: 'User account not found.' });
        return;
      }

      const isValidToken = await userRepository.hasRefreshToken(user.id, refreshToken);
      if (!isValidToken) {
        res.status(403).json({ success: false, message: 'Invalid or revoked refresh token.' });
        return;
      }

      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };

      const newAccessToken = jwt.sign(tokenPayload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
      });

      res.status(200).json({
        success: true,
        data: {
          accessToken: newAccessToken,
        },
      });
    } catch {
      res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token. Please login again.',
      });
    }
  }

  /**
   * GET /api/auth/me
   * Returns current authenticated user profile
   */
  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  }
}

export const authController = new AuthController();
