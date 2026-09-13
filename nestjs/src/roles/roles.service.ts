import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { db } from '../prisma/db.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

@Injectable()
export class RolesService {
  async create(data: CreateRoleDto) {
    const existingRole = await db.orm.public.Role.first({
      name: data.name,
    });

    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    const role = await db.orm.public.Role.create({
      name: data.name,
      description: data.description,
    });

    const assignedPermissions: string[] = [];

    for (const permissionName of data.permissions ?? []) {
      const permission = await db.orm.public.Permission.first({
        name: permissionName,
      });

      if (!permission) {
        throw new BadRequestException(
          `Permission "${permissionName}" does not exist`,
        );
      }

      await db.orm.public.RolePermission.create({
        roleId: role.id,
        permissionId: permission.id,
      });

      assignedPermissions.push(permission.name);
    }

    return {
      ...role,
      permissions: assignedPermissions,
    };
  }

  async findAll() {
    return db.orm.public.Role.all();
  }

  async findAllPermissions() {
    return db.orm.public.Permission.all();
  }

  async findOne(id: number) {
    const role = await db.orm.public.Role.first({
      id,
    });

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const rolePermissions = await db.orm.public.RolePermission
      .where({ roleId: id })
      .all();

    const permissions = [];

    for (const item of rolePermissions) {
      const permission = await db.orm.public.Permission.first({
        id: item.permissionId,
      });

      if (permission) {
        permissions.push(permission);
      }
    }

    return {
      ...role,
      permissions,
    };
  }


 async update(id: number, data: UpdateRoleDto) {
  const role = await db.orm.public.Role.first({ id });

  if (!role) {
    throw new BadRequestException('Role not found');
  }
   if (role.name === 'super_admin') {
    throw new BadRequestException('super_admin role cannot be modified');
  }

  if (data.name && data.name !== role.name) {
    const existingRole = await db.orm.public.Role.first({
      name: data.name,
    });

    if (existingRole) {
      throw new ConflictException('Role already exists');
    }
  }

  const validPermissions = [];

  if (data.permissions) {
    for (const permissionName of data.permissions) {
      const permission = await db.orm.public.Permission.first({
        name: permissionName,
      });

      if (!permission) {
        throw new BadRequestException(
          `Permission "${permissionName}" does not exist`,
        );
      }

      validPermissions.push(permission);
    }
  }

  await db.orm.public.Role
  .where({ id })
  .update({
    name: data.name ?? role.name,
    description: data.description ?? role.description,
  });

  if (data.permissions) {
    const existingPermissions = await db.orm.public.RolePermission
      .where({ roleId: id })
      .all();

    for (const item of existingPermissions) {

      await db.orm.public.RolePermission
  .where({
    roleId: item.roleId,
    permissionId: item.permissionId,
  })
  .delete();
    }

    for (const permission of validPermissions) {
      await db.orm.public.RolePermission.create({
        roleId: id,
        permissionId: permission.id,
      });
    }
  }

  return this.findOne(id);
}

async remove(id: number) {
  const role = await db.orm.public.Role.first({ id });

  if (!role) {
    throw new BadRequestException('Role not found');
  }

  if (role.name === 'super_admin') {
    throw new BadRequestException('super_admin role cannot be deleted');
  }

  const assignedAdmins = await db.orm.public.AdminRole
    .where({ roleId: id })
    .all();

  if (assignedAdmins.length > 0) {
    throw new BadRequestException(
      'This role is assigned to an admin and cannot be deleted',
    );
  }

  const rolePermissions = await db.orm.public.RolePermission
    .where({ roleId: id })
    .all();

  for (const item of rolePermissions) {
    await db.orm.public.RolePermission
      .where({
        roleId: item.roleId,
        permissionId: item.permissionId,
      })
      .delete();
  }

  await db.orm.public.Role
    .where({ id })
    .delete();

  return {
    message: 'Role deleted successfully',
  };
}


}