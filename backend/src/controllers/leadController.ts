import { Request, Response } from 'express';
import { z } from 'zod';
import { leadService } from '../services/leadService';
import { AuthenticatedRequest } from '../middleware/auth';

const LeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Please enter a valid phone number').max(30),
  message: z.string().min(10, 'Message must be at least 10 characters long').max(2000),
  source: z.string().optional().default('landing_page'),
});

export class LeadController {
  /**
   * POST /api/leads (Public)
   * Captures and stores new lead, records audit log, and notifies admin
   */
  async createLead(req: Request, res: Response): Promise<void> {
    const clientMeta = {
      ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown Agent',
      referer: req.headers['referer'],
    };

    const parseResult = LeadSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');

      // Log validation failure event to MongoDB audit telemetry
      await leadService.logAuditEvent(clientMeta, req.body, 'VALIDATION_FAILED', undefined, errorMsg);

      res.status(400).json({
        success: false,
        message: 'Invalid submission data.',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    try {
      const lead = await leadService.createLead(parseResult.data, clientMeta);

      res.status(201).json({
        success: true,
        message: 'Thank you! Your inquiry has been successfully submitted. Our team will contact you shortly.',
        data: {
          id: lead.id,
          name: lead.name,
          created_at: lead.created_at,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Server error processing your inquiry. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * GET /api/leads (Protected: Admin & Viewer)
   * Returns list of leads
   */
  async getLeads(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const leads = await leadService.getLeads();
      res.status(200).json({
        success: true,
        count: leads.length,
        data: leads,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve leads.',
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/leads/:id (Protected: Admin only)
   * Deletes a lead
   */
  async deleteLead(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = req.params.id as string;

    if (!id) {
      res.status(400).json({ success: false, message: 'Lead ID parameter is required.' });
      return;
    }

    try {
      const deleted = await leadService.deleteLead(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `Lead with ID ${id} not found.`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Lead ${id} successfully deleted.`,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete lead.',
        error: error.message,
      });
    }
  }
}

export const leadController = new LeadController();
