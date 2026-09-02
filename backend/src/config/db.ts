import { createClient, SupabaseClient } from '@supabase/supabase-js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * ============================================================================
 * DATABASE CONFIGURATION: POLYGLOT PERSISTENCE ARCHITECTURE
 * ============================================================================
 * 
 * 1. PostgreSQL (via Supabase):
 *    Acts as the primary transactional System of Record (SoR).
 *    Stores structured, sanitized business leads requiring ACID guarantees,
 *    relational indexing, and strict schema validation.
 * 
 *    Supabase SQL Schema:
 *    CREATE TABLE IF NOT EXISTS leads (
 *      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *      name VARCHAR(255) NOT NULL,
 *      email VARCHAR(255) NOT NULL,
 *      phone VARCHAR(50),
 *      message TEXT NOT NULL,
 *      source VARCHAR(100) DEFAULT 'landing_page',
 *      created_at TIMESTAMPTZ DEFAULT NOW()
 *    );
 * 
 * 2. MongoDB:
 *    Acts as the high-throughput, append-only Event Store for raw submission
 *    telemetry, request headers, client IP, and analytics audit trails.
 * ============================================================================
 */

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  created_at: string;
}

// In-memory fallback repository for PostgreSQL leads when working offline or before Supabase credentials are set
class MemoryLeadStore {
  private leads: LeadRecord[] = [];

  constructor() {
    // Seed a sample lead for immediate testing
    this.leads.push({
      id: 'd9b1a7d2-43f1-4b72-8821-fae120199e1a',
      name: 'Sarah Connor',
      email: 'sarah.connor@cyberdyne.org',
      phone: '+1 (555) 019-2834',
      message: 'Looking for an enterprise consultation regarding cloud automation.',
      source: 'landing_hero',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    });
  }

  async insert(lead: Omit<LeadRecord, 'id' | 'created_at'>): Promise<LeadRecord> {
    const newRecord: LeadRecord = {
      id: crypto.randomUUID ? crypto.randomUUID() : `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...lead,
      created_at: new Date().toISOString(),
    };
    this.leads.unshift(newRecord);
    return newRecord;
  }

  async findAll(): Promise<LeadRecord[]> {
    return [...this.leads];
  }

  async deleteById(id: string): Promise<boolean> {
    const initialLen = this.leads.length;
    this.leads = this.leads.filter((item) => item.id !== id);
    return this.leads.length < initialLen;
  }
}

export const memoryLeadStore = new MemoryLeadStore();

// Supabase Client Setup
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseKey) &&
  !supabaseUrl.includes('mock-leadgen-project') &&
  !supabaseKey.includes('mock-supabase-service-role-key');

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (isSupabaseConfigured) {
  console.log('[Database] Supabase PostgreSQL client initialized.');
} else {
  console.log('[Database] Live Supabase credentials not detected; using in-memory PostgreSQL simulation fallback for instant local dev.');
}

// MongoDB Connection Setup
export let isMongoConnected = false;

export const connectMongoDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leadgen_audit';
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB connected successfully to: ${mongoUri}`);
  } catch (error: any) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB connection skipped/failed (${error.message}). Audit events will gracefully log to fallback logger without blocking transactions.`);
  }
};
