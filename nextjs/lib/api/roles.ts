import { API_URL } from "./client";

export type Role = {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Permission = {
  id: number;
  name: string;
  description?: string | null;
};

export type RoleDetails = Role & {
  permissions: Permission[];
};

export type CreateRoleInput = {
  name: string;
  description?: string;
  permissions?: string[];
};

// Get all roles
export async function getRoles(): Promise<Role[]> {
  const response = await fetch(`${API_URL}/roles`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch roles");
  }

  return response.json();
}

// Get all available permissions
export async function getPermissions(): Promise<Permission[]> {
  const response = await fetch(`${API_URL}/roles/permissions`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch permissions");
  }

  return response.json();
}

// Get single role with assigned permissions
export async function getRole(id: number): Promise<RoleDetails> {
  const response = await fetch(`${API_URL}/roles/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch role: ${response.status}`);
  }

  return response.json();
}

// Create new role
export async function createRole(
  data: CreateRoleInput,
): Promise<Role> {
  const response = await fetch(`${API_URL}/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create role");
  }

  return response.json();
}

// Update existing role
export async function updateRole(
  id: number,
  data: CreateRoleInput,
): Promise<RoleDetails> {
  const response = await fetch(`${API_URL}/roles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update role");
  }

  return response.json();
}

// Delete role
export async function deleteRole(id: number) {
  const response = await fetch(`${API_URL}/roles/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.message || "Failed to delete role",
    );
  }

  return response.json();
}