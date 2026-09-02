import { supabase, isSupabaseConfigured, memoryLeadStore, LeadRecord, isMongoConnected } from '../config/db';
import { AuditLog } from '../models/AuditLog';
import { sendNewLeadNotification } from './emailService';

export interface CreateLeadDTO {
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
}

export interface RequestMetadata {
  ip: string;
  userAgent: string;
  referer?: string;
}

export class LeadService {
  /**
   * Process a new lead submission:
   * 1. Log raw audit event to MongoDB (immutable audit trail)
   * 2. Persist sanitized lead to PostgreSQL via Supabase
   * 3. Trigger asynchronous email notification via Nodemailer
   */
  async createLead(dto: CreateLeadDTO, meta: RequestMetadata): Promise<LeadRecord> {
    const source = dto.source || 'landing_page';
    let savedLead: LeadRecord;

    // Step 1: Persist to PostgreSQL (Supabase or In-Memory Store)
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert([
            {
              name: dto.name,
              email: dto.email,
              phone: dto.phone,
              message: dto.message,
              source,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error('[LeadService] Supabase insert error:', error.message);
          throw new Error(`Database error: ${error.message}`);
        }

        savedLead = data as LeadRecord;
      } catch (err: any) {
        console.warn(`[LeadService] Fallback to memory store due to Supabase error: ${err.message}`);
        savedLead = await memoryLeadStore.insert({
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          message: dto.message,
          source,
        });
      }
    } else {
      savedLead = await memoryLeadStore.insert({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        message: dto.message,
        source,
      });
    }

    // Step 2: Log Raw Form Submission Event to MongoDB (Append-Only Event Store)
    this.logAuditEvent(meta, dto, 'SUCCESS', savedLead.id).catch((err) => {
      console.error('[LeadService] Async Mongo Audit log failed:', err.message);
    });

    // Step 3: Trigger Nodemailer Email Notification (Asynchronous)
    sendNewLeadNotification(savedLead).catch((err) => {
      console.error('[LeadService] Notification delivery failed:', err.message);
    });

    return savedLead;
  }

  /**
   * Log raw submission telemetry to MongoDB
   */
  async logAuditEvent(
    meta: RequestMetadata,
    payload: Record<string, any>,
    status: 'SUCCESS' | 'VALIDATION_FAILED' | 'ERROR',
    leadId?: string,
    errorMessage?: string
  ): Promise<void> {
    try {
      if (isMongoConnected) {
        await AuditLog.create({
          eventType: 'LEAD_FORM_SUBMISSION',
          ipAddress: meta.ip,
          userAgent: meta.userAgent,
          referer: meta.referer || '',
          rawPayload: payload,
          status,
          errorMessage,
          leadId,
        });
        console.log(`[LeadService] Raw submission telemetry recorded in MongoDB (Lead ID: ${leadId || 'N/A'}).`);
      } else {
        console.log(`[LeadService] Mongo offline - Fallback audit entry: [${status}] from IP: ${meta.ip}`);
      }
    } catch (error: any) {
      console.error('[LeadService] Failed to record MongoDB audit log:', error.message);
    }
  }

  /**
   * Retrieve all leads (for Admin & Viewer roles)
   */
  async getLeads(): Promise<LeadRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[LeadService] Supabase select error:', error.message);
          return await memoryLeadStore.findAll();
        }

        return data as LeadRecord[];
      } catch (err: any) {
        console.warn(`[LeadService] Fallback to memory store for leads fetch: ${err.message}`);
        return await memoryLeadStore.findAll();
      }
    }

    return await memoryLeadStore.findAll();
  }

  /**
   * Delete lead by ID (Admin role only)
   */
  async deleteLead(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) {
          console.error('[LeadService] Supabase delete error:', error.message);
          return await memoryLeadStore.deleteById(id);
        }
        return true;
      } catch (err: any) {
        console.warn(`[LeadService] Fallback to memory store for lead delete: ${err.message}`);
        return await memoryLeadStore.deleteById(id);
      }
    }

    return await memoryLeadStore.deleteById(id);
  }
}

export const leadService = new LeadService();
