import { API_URL } from './client';

export type ActivityLog = {
  id: number;
  adminId: number | null;
  action: string;
  entityType: string;
  entityId: number | null;
  entityLabel: string | null;
  entityLabelAr: string | null;
  ipAddress: string | null;
  createdAt: string;
  admin: {
    name: string;
    email: string;
  } | null;
};

// Get admin activity logs
export async function getActivityLogs(): Promise<ActivityLog[]> {
  const response = await fetch(`${API_URL}/activity-logs`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to load activity logs');
  }

  return response.json();
}