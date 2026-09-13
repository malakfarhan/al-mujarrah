import 'dotenv/config';
import { db } from '../prisma/db.js';

const permissions = [
  'dashboard.view',

  'leads.view',
  'leads.update',
  'leads.delete',

  'quotations.view',
  'quotations.create',
  'quotations.update',
  'quotations.delete',

  'projects.view',
  'projects.create',
  'projects.update',
  'projects.delete',

  'blog.view',
  'blog.create',
  'blog.update',
  'blog.delete',

  'support.view',
  'support.update',

  'reports.view',

  'admins.view',
  'admins.create',
  'admins.update',
  'admins.delete',

  'roles.view',
  'roles.create',
  'roles.update',
  'roles.delete',
];

async function seedRbac() {
  const role = await db.orm.public.Role.first({
    name: 'super_admin',
  });

  if (!role) {
    throw new Error('super_admin role not found');
  }

  for (const name of permissions) {
    let permission = await db.orm.public.Permission.first({
      name,
    });

    if (!permission) {
      permission = await db.orm.public.Permission.create({
        name,
      });
    }

    const existing = await db.orm.public.RolePermission.first({
      roleId: role.id,
      permissionId: permission.id,
    });

    if (!existing) {
      await db.orm.public.RolePermission.create({
        roleId: role.id,
        permissionId: permission.id,
      });
    }
  }

  console.log('RBAC permissions seeded successfully');
}

seedRbac().catch((error) => {
  console.error(error);
  process.exit(1);
});