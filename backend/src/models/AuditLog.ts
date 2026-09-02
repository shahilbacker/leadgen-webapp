import mongoose, { Schema, Document } from 'mongoose';

/**
 * ============================================================================
 * ARCHITECTURAL RATIONALE: WHY MONGODB AUDIT LOGS ARE SEPARATE FROM SQL LEADS
 * ============================================================================
 * 
 * 1. Heterogeneous Data Structures & Schema Flexibility:
 *    - The PostgreSQL `leads` table represents a strictly structured business
 *      entity containing normalized fields (`name`, `email`, `phone`, `message`).
 *    - The MongoDB audit collection captures raw telemetry: HTTP headers, IP address,
 *      User-Agent, query parameters (UTM campaign, adgroup, click IDs), referrer,
 *      and the unmodified raw JSON request body before sanitization. If tracking
 *      tags or analytics metrics change, MongoDB handles schema drift effortlessly
 *      without requiring SQL database migrations (`ALTER TABLE`).
 * 
 * 2. Immutable Event Sourcing & Non-repudiation:
 *    - Leads in PostgreSQL can be edited or deleted (e.g., GDPR "Right to be Forgotten",
 *      admin data hygiene).
 *    - Audit logs in MongoDB are append-only. They preserve an immutable historical
 *      record of exactly what was transmitted at any given millisecond, enabling
 *      forensic audits, rate-limit abuse detection, and fraud prevention.
 * 
 * 3. Write Contention & Decoupled Performance:
 *    - During high-traffic marketing campaigns (e.g., Super Bowl ad or viral campaign),
 *      high write loads on analytics should not degrade transactional query performance
 *      on the primary SQL CRM database. MongoDB is optimized for horizontal write scaling
 *      and fast document ingestion.
 * 
 * 4. Separation of Concerns (CQRS / Analytics vs. Transactional):
 *    - Sales representatives query PostgreSQL for operational lead triage.
 *    - Marketing teams, BI pipelines, and security auditors query MongoDB for conversion
 *      funnel analytics, bot detection, and historical access trails.
 * ============================================================================
 */

export interface IAuditLog extends Document {
  eventType: string;
  ipAddress: string;
  userAgent: string;
  referer?: string;
  rawPayload: Record<string, any>;
  status: 'SUCCESS' | 'VALIDATION_FAILED' | 'ERROR';
  errorMessage?: string;
  leadId?: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    eventType: {
      type: String,
      required: true,
      default: 'LEAD_FORM_SUBMISSION',
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    referer: {
      type: String,
      default: '',
    },
    rawPayload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'VALIDATION_FAILED', 'ERROR'],
      required: true,
      index: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    leadId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false }, // Append-only immutable log
  }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
