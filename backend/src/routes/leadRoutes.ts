import { Router } from 'express';
import { leadController } from '../controllers/leadController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Public: Submit a new lead from the landing page
router.post('/', (req, res) => leadController.createLead(req, res));

// Protected: View all leads (accessible to both 'admin' and 'viewer' roles)
router.get(
  '/',
  authenticateToken,
  requireRole('admin', 'viewer'),
  (req, res) => leadController.getLeads(req, res)
);

// Protected: Delete a lead (accessible ONLY to 'admin' role)
router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  (req, res) => leadController.deleteLead(req, res)
);

export default router;
