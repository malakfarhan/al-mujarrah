import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';

import { db } from '../prisma/db.js';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string, ipAddress?: string) {
    const admin = await db.orm.public.Admin.first({ email });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const validPassword = await argon2.verify(admin.passwordHash, password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const adminRole = await db.orm.public.AdminRole.first({
      adminId: admin.id,
    });

    if (!adminRole) {
      throw new UnauthorizedException('Admin role not assigned');
    }

    const role = await db.orm.public.Role.first({
      id: adminRole.roleId,
    });

    if (!role) {
      throw new UnauthorizedException('Admin role not found');
    }

    // Update successful login time
    await db.orm.public.Admin.where({ id: admin.id }).update({
      lastLoginAt: new Date().toISOString(),
    });

    // Record successful login without blocking login if logging fails
    try {
      await db.orm.public.ActivityLog.create({
        adminId: admin.id,
        action: 'login',
        entityType: 'admin',
        entityId: admin.id,
        entityLabel: admin.name,
        ipAddress: ipAddress?.trim() || undefined,
      });
    } catch (error) {
      console.error('Failed to create login activity log:', error);
    }

    // Create login token
    const token = await this.jwtService.signAsync({
      sub: admin.id,
      email: admin.email,
      role: role.name.trim(),
    });

    return {
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: role.name.trim(),
      },
    };
  }
}