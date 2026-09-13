import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { db } from '../../prisma/db.js';
import {
  PERMISSIONS_KEY,
} from '../decorators/permissions.decorator.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Read required permission from controller route
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    // Route has no permission requirement
    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // JwtAuthGuard already puts logged-in admin here
    const adminId = request.user?.sub;

    if (!adminId) {
      throw new ForbiddenException('Admin session not found');
    }

        if (request.user?.role === 'super_admin') {
             return true;
        }

    // Get admin roles only once
    const adminRoles = await db.orm.public.AdminRole
      .where({ adminId })
      .all();

    if (adminRoles.length === 0) {
      throw new ForbiddenException('No role assigned');
    }

    // Keep role IDs in memory for fast checking
    const adminRoleIds = new Set(
      adminRoles.map((adminRole) => adminRole.roleId),
    );

    // Check only permissions required by this endpoint
    for (const permissionName of requiredPermissions) {
      const permission = await db.orm.public.Permission.first({
        name: permissionName,
      });

      if (!permission) {
        throw new ForbiddenException(
          `Permission "${permissionName}" does not exist`,
        );
      }

      // Get only role mappings for this required permission
      const rolePermissions = await db.orm.public.RolePermission
        .where({
          permissionId: permission.id,
        })
        .all();

      const hasPermission = rolePermissions.some((item) =>
        adminRoleIds.has(item.roleId),
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          'You do not have permission to perform this action',
        );
      }
    }

    return true;
  }
}