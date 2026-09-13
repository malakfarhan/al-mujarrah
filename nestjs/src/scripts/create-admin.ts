import 'dotenv/config';
import argon2 from 'argon2';
import { db } from '../prisma/db.js';

async function createAdmin() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      'ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required',
    );
  }

  let role = await db.orm.public.Role.first({
    name: 'super_admin',
  });

  if (!role) {
    role = await db.orm.public.Role.create({
      name: 'super_admin',
      description: 'Full system access',
    });
  }

  let admin = await db.orm.public.Admin.first({
    email,
  });

  if (!admin) {
    const passwordHash = await argon2.hash(password);

    admin = await db.orm.public.Admin.create({
      name,
      email,
      passwordHash,
      isActive: true,
    });
  }

  const existingRole = await db.orm.public.AdminRole.first({
    adminId: admin.id,
    roleId: role.id,
  });

  if (!existingRole) {
    await db.orm.public.AdminRole.create({
      adminId: admin.id,
      roleId: role.id,
    });
  }

  console.log('Super admin created successfully');
}

createAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});