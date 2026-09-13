import { Injectable } from '@nestjs/common';

import { db } from '../prisma/db.js';

export type CreateActivityLogInput = {
  adminId?: number | null;
  action: string;
  entityType: string;
  entityId?: number | null;
  entityLabel?: string | null;
  entityLabelAr?: string | null;
  ipAddress?: string | null;
};

@Injectable()
export class ActivityLogsService {
  // Admin: get recent activity logs
  async findAll() {
    const [logs, admins] = await Promise.all([
      db.orm.public.ActivityLog.all(),
      db.orm.public.Admin.all(),
    ]);

    const adminMap = new Map(
      admins.map((admin) => [
        admin.id,
        {
          name: admin.name,
          email: admin.email,
        },
      ]),
    );

    return logs
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
      .map((log) => ({
        ...log,
        admin: log.adminId
          ? adminMap.get(log.adminId) || null
          : null,
      }));
  }

  // Reusable logger for other modules
  async log(data: CreateActivityLogInput) {
    try {
      return await db.orm.public.ActivityLog.create({
        adminId: data.adminId ?? undefined,
        action: data.action.trim(),
        entityType: data.entityType.trim(),
        entityId: data.entityId ?? undefined,
        entityLabel: data.entityLabel?.trim() || undefined,
        entityLabelAr: data.entityLabelAr?.trim() || undefined,
        ipAddress: data.ipAddress?.trim() || undefined,
      });
    } catch (error) {
      // Activity logging must not crash the main business action.
      console.error('Failed to create activity log:', error);
      return null;
    }
  }
}