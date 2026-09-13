import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';

import { db } from '../prisma/db.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';

@Injectable()
export class AdminsService {
  async create(data: CreateAdminDto) {
    // Check duplicate email
    const existingAdmin = await db.orm.public.Admin.first({
      email: data.email,
    });

    if (existingAdmin) {
      throw new ConflictException('Admin email already exists');
    }

    // Validate roles before creating admin
    const validRoles = [];

    if (data.roleIds?.length) {
      for (const roleId of data.roleIds) {
        const role = await db.orm.public.Role.first({
          id: roleId,
        });

        if (!role) {
          throw new BadRequestException(
            `Role with id ${roleId} does not exist`,
          );
        }

        validRoles.push(role);
      }
    }

    // Hash password
    const passwordHash = await argon2.hash(data.password);

    // Create admin
    const admin = await db.orm.public.Admin.create({
      name: data.name,
      email: data.email,
      passwordHash,

      // Use selected status, default Active
      isActive: data.isActive ?? true,
    });

    // Assign selected roles
    for (const role of validRoles) {
      await db.orm.public.AdminRole.create({
        adminId: admin.id,
        roleId: role.id,
      });
    }

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
      roles: validRoles.map((role) => ({
        id: role.id,
        name: role.name,
      })),
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }

  async findAll() {
    // Get all admins
    const admins = await db.orm.public.Admin.all();

    const result = [];

    for (const admin of admins) {
      // Get assigned role mappings
      const adminRoles = await db.orm.public.AdminRole
        .where({
          adminId: admin.id,
        })
        .all();

      const roles = [];

      for (const adminRole of adminRoles) {
        const role = await db.orm.public.Role.first({
          id: adminRole.roleId,
        });

        if (role) {
          roles.push({
            id: role.id,
            name: role.name,
          });
        }
      }

      result.push({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        isActive: admin.isActive,
        lastLoginAt: admin.lastLoginAt,
        roles,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      });
    }

    return result;
  }

  async update(id: number, data: UpdateAdminDto) {
    // Find admin
    const admin = await db.orm.public.Admin.first({
      id,
    });

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    // Get current admin roles
    const currentAdminRoles = await db.orm.public.AdminRole
      .where({
        adminId: id,
      })
      .all();

    let isSuperAdmin = false;

    // Check if account is super_admin
    for (const adminRole of currentAdminRoles) {
      const role = await db.orm.public.Role.first({
        id: adminRole.roleId,
      });

      if (role?.name.trim() === 'super_admin') {
        isSuperAdmin = true;
        break;
      }
    }

    // Protect super_admin from deactivation
    if (isSuperAdmin && data.isActive === false) {
      throw new BadRequestException(
        'super_admin account cannot be deactivated',
      );
    }

    // Protect super_admin roles
    if (isSuperAdmin && data.roleIds) {
      throw new BadRequestException(
        'super_admin roles cannot be modified',
      );
    }

    // Check duplicate email
    if (data.email && data.email !== admin.email) {
      const existingEmail = await db.orm.public.Admin.first({
        email: data.email,
      });

      if (existingEmail) {
        throw new ConflictException(
          'Admin email already exists',
        );
      }
    }

    // Validate roles before update
    const validRoles = [];

    if (data.roleIds) {
      for (const roleId of data.roleIds) {
        const role = await db.orm.public.Role.first({
          id: roleId,
        });

        if (!role) {
          throw new BadRequestException(
            `Role with id ${roleId} does not exist`,
          );
        }

        validRoles.push(role);
      }
    }

    // Keep current password by default
    let passwordHash = admin.passwordHash;

    // Hash new password only if provided
    if (data.password) {
      passwordHash = await argon2.hash(
        data.password,
      );
    }

    // Update admin
    await db.orm.public.Admin
      .where({
        id,
      })
      .update({
        name: data.name ?? admin.name,
        email: data.email ?? admin.email,
        passwordHash,
        isActive:
          data.isActive ?? admin.isActive,
      });

    // Update roles only when roleIds provided
    if (data.roleIds) {
      const existingRoles =
        await db.orm.public.AdminRole
          .where({
            adminId: id,
          })
          .all();

      // Remove old roles
      for (const item of existingRoles) {
        await db.orm.public.AdminRole
          .where({
            adminId: item.adminId,
            roleId: item.roleId,
          })
          .delete();
      }

      // Add selected roles
      for (const role of validRoles) {
        await db.orm.public.AdminRole.create({
          adminId: id,
          roleId: role.id,
        });
      }
    }

    return {
      message: 'Admin updated successfully',
    };
  }
}