import { API_URL } from "./client";

export type AdminRole = {
  id: number;
  name: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  lastLoginAt?: string | null;
  roles: AdminRole[];
  createdAt: string;
  updatedAt: string;
};

export type CreateAdminInput = {
  name: string;
  email: string;
  password: string;
  roleIds?: number[];
   isActive?: boolean;
};

export type UpdateAdminInput = {
  name?: string;
  email?: string;
  password?: string;
  roleIds?: number[];
  isActive?: boolean;
};

// Get all admin users
export async function getAdmins(): Promise<AdminUser[]> {
  const response = await fetch(`${API_URL}/admins`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admins");
  }

  return response.json();
}

// Create new admin
export async function createAdmin(
  data: CreateAdminInput,
): Promise<AdminUser> {
  const response = await fetch(`${API_URL}/admins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.message || "Failed to create admin",
    );
  }

  return response.json();
}

// Update admin
export async function updateAdmin(
  id: number,
  data: UpdateAdminInput,
) {
  const response = await fetch(`${API_URL}/admins/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.message || "Failed to update admin",
    );
  }

  return response.json();
}