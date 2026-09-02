const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface LeadSubmissionData {
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
}

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Public: Submit a lead capture form
 */
export async function submitLead(data: LeadSubmissionData): Promise<{ success: boolean; message: string; data?: any }> {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(result.message || 'Failed to submit inquiry', response.status, result.errors);
  }

  return result;
}

/**
 * Admin: Login with email & password
 */
export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(result.message || 'Invalid login credentials', response.status);
  }

  return result;
}

/**
 * Admin: Exchange refresh token for new access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(result.message || 'Token refresh failed', response.status);
  }

  return result.data.accessToken;
}

/**
 * Admin / Viewer: Fetch leads list
 */
export async function fetchLeads(accessToken: string): Promise<LeadItem[]> {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(result.message || 'Failed to fetch leads', response.status);
  }

  return result.data;
}

/**
 * Admin only: Delete lead by ID
 */
export async function deleteLead(id: string, accessToken: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(result.message || 'Failed to delete lead', response.status);
  }
}
