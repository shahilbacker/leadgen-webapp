import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public auth endpoints
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refresh(req, res));

// Protected profile endpoint
router.get('/me', authenticateToken, (req, res) => authController.getMe(req, res));

export default router;
