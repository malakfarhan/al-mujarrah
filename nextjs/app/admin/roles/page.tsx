"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Eye,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import AdminLoader from "@/components/admin/AdminLoader";

import {
  createRole,
  deleteRole,
  getPermissions,
  getRole,
  getRoles,
  updateRole,
  type Permission,
  type Role,
  type RoleDetails,
} from "@/lib/api/roles";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [selectedRole, setSelectedRole] = useState<RoleDetails | null>(null);
  const [editingRole, setEditingRole] = useState<RoleDetails | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [rolesData, permissionsData] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);

      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      console.error(error);
      setError("Unable to load roles.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function togglePermission(name: string) {
    setSelectedPermissions((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setCreating(true);
    setError("");

    try {
      // Create role in backend
      const newRole = await createRole({
        name: String(formData.get("name") || ""),
        description: String(formData.get("description") || ""),
        permissions: selectedPermissions,
      });

      // Add new role instantly to table
      setRoles((current) => [...current, newRole]);

      form.reset();
      setSelectedPermissions([]);
      setCreateOpen(false);
    } catch (error) {
      console.error(error);
      setError("Unable to create role. Role name may already exist.");
    } finally {
      setCreating(false);
    }
  }

  async function handleView(id: number) {
    setViewOpen(true);
    setRoleLoading(true);
    setSelectedRole(null);
    setError("");

    try {
      const data = await getRole(id);
      setSelectedRole(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load role.");
      setViewOpen(false);
    } finally {
      setRoleLoading(false);
    }
  }

  async function handleEdit(id: number) {
    setEditOpen(true);
    setRoleLoading(true);
    setEditingRole(null);
    setSelectedPermissions([]);
    setError("");

    try {
      const data = await getRole(id);

      setEditingRole(data);

      setSelectedPermissions(
        data.permissions.map((permission) => permission.name),
      );
    } catch (error) {
      console.error(error);
      setError("Unable to load role.");
      setEditOpen(false);
    } finally {
      setRoleLoading(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingRole) return;

    const formData = new FormData(event.currentTarget);

    setUpdating(true);
    setError("");

    try {
      // Update role in backend
      const updatedRole = await updateRole(editingRole.id, {
        name: String(formData.get("name") || ""),
        description: String(formData.get("description") || ""),
        permissions: selectedPermissions,
      });

      // Update role instantly in table
      setRoles((current) =>
        current.map((role) =>
          role.id === updatedRole.id ? updatedRole : role,
        ),
      );

      setEditOpen(false);
      setEditingRole(null);
      setSelectedPermissions([]);
    } catch (error) {
      console.error(error);
      setError("Unable to update role.");
    } finally {
      setUpdating(false);
    }
  }

  function openDelete(role: Role) {
    if (role.name === "super_admin") return;

    setDeletingRole(role);
    setDeleteOpen(true);
    setError("");
  }

  async function handleDelete() {
    if (!deletingRole) return;

    setDeleting(true);
    setError("");

    try {
      await deleteRole(deletingRole.id);

      // Remove deleted role instantly from table
      setRoles((current) =>
        current.filter((role) => role.id !== deletingRole.id),
      );

      setDeleteOpen(false);
      setDeletingRole(null);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete role.",
      );
    } finally {
      setDeleting(false);
    }
  }

  const groupedPermissions = permissions.reduce<Record<string, Permission[]>>(
    (groups, permission) => {
      const group = permission.name.split(".")[0];

      if (!groups[group]) {
        groups[group] = [];
      }

      groups[group].push(permission);

      return groups;
    },
    {},
  );

  if (loading) {
    return (
      <AdminLoader
        text="Loading roles"
        subtext="Fetching roles and permissions..."
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[.14em] text-teal-deep">
            Access Control
          </span>

          <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
            Roles & permissions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create roles and control access across the admin workspace.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedPermissions([]);
            setError("");
            setCreateOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-xs font-black text-white"
        >
          <Plus size={16} />
          Create Role
        </button>
      </div>

      {error && !createOpen && !editOpen && !deleteOpen && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {["Role", "Description", "Created", "Action"].map((item) => (
                  <th
                    key={item}
                    className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-left text-[10px] font-black uppercase tracking-[.08em] text-slate-400"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {roles.map((role) => {
                const protectedRole = role.name === "super_admin";

                return (
                  <tr key={role.id}>
                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf9f6] text-teal-deep">
                          <ShieldCheck size={17} />
                        </span>

                        <div>
                          <strong className="text-sm text-ink">
                            {role.name}
                          </strong>

                          {protectedRole && (
                            <span className="ml-2 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black text-slate-500">
                              Protected
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-500">
                      {role.description || "—"}
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-500">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(role.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          <Eye size={14} />
                          View
                        </button>

                        <button
                          disabled={protectedRole}
                          onClick={() => handleEdit(role.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          disabled={protectedRole}
                          onClick={() => openDelete(role)}
                          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {roles.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-sm text-slate-400"
                  >
                    No roles created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <ModalHeader
              title="Create role"
              description="Select exactly what this role can access."
              onClose={() => {
                setCreateOpen(false);
                setSelectedPermissions([]);
                setError("");
              }}
            />

            <form onSubmit={handleCreate}>
              <RoleFields />

              <PermissionGroups
                groupedPermissions={groupedPermissions}
                selectedPermissions={selectedPermissions}
                togglePermission={togglePermission}
              />

              {error && <ErrorBox message={error} />}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCreateOpen(false);
                    setSelectedPermissions([]);
                    setError("");
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-ink px-5 py-3 text-xs font-black text-white disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-[650px] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <ModalHeader
              title="Role details"
              description="Assigned permissions for this role."
              onClose={() => {
                setViewOpen(false);
                setSelectedRole(null);
              }}
            />

            {roleLoading ? (
              <AdminLoader
                text="Loading role"
                subtext="Fetching assigned permissions..."
              />
            ) : (
              selectedRole && (
                <div className="mt-6">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <strong className="block text-lg text-ink">
                      {selectedRole.name}
                    </strong>

                    <span className="mt-1 block text-sm text-slate-400">
                      {selectedRole.description || "No description"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {selectedRole.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="rounded-xl border border-slate-200 px-3 py-3 text-xs font-bold text-slate-600"
                      >
                        {permission.name}
                      </div>
                    ))}
                  </div>

                  {selectedRole.permissions.length === 0 && (
                    <p className="mt-6 text-center text-sm text-slate-400">
                      No permissions assigned.
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <ModalHeader
              title="Edit role"
              description="Update role information and permissions."
              onClose={() => {
                setEditOpen(false);
                setEditingRole(null);
                setSelectedPermissions([]);
                setError("");
              }}
            />

            {roleLoading ? (
              <AdminLoader
                text="Loading role"
                subtext="Fetching role permissions..."
              />
            ) : (
              editingRole && (
                <form onSubmit={handleUpdate}>
                  <RoleFields role={editingRole} />

                  <PermissionGroups
                    groupedPermissions={groupedPermissions}
                    selectedPermissions={selectedPermissions}
                    togglePermission={togglePermission}
                  />

                  {error && <ErrorBox message={error} />}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditOpen(false);
                        setEditingRole(null);
                        setSelectedPermissions([]);
                        setError("");
                      }}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-600"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={updating}
                      className="rounded-xl bg-ink px-5 py-3 text-xs font-black text-white disabled:opacity-60"
                    >
                      {updating ? "Updating..." : "Update Role"}
                    </button>
                  </div>
                </form>
              )
            )}
          </div>
        </div>
      )}

      {deleteOpen && deletingRole && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-[460px] rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  Delete role
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Are you sure you want to delete{" "}
                  <strong className="text-ink">
                    {deletingRole.name}
                  </strong>
                  ?
                </p>
              </div>

              <button
                onClick={() => {
                  setDeleteOpen(false);
                  setDeletingRole(null);
                  setError("");
                }}
                className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            {error && <ErrorBox message={error} />}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteOpen(false);
                  setDeletingRole(null);
                  setError("");
                }}
                className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-600"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-5 py-3 text-xs font-black text-white disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModalHeader({
  title,
  description,
  onClose,
}: {
  title: string;
  description: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500"
      >
        <X size={17} />
      </button>
    </div>
  );
}

function RoleFields({
  role,
}: {
  role?: RoleDetails;
}) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <label className="text-xs font-bold text-slate-600">
        Role name
        <input
          name="name"
          required
          defaultValue={role?.name || ""}
          placeholder="sales_admin"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-deep"
        />
      </label>

      <label className="text-xs font-bold text-slate-600">
        Description
        <input
          name="description"
          defaultValue={role?.description || ""}
          placeholder="Sales team access"
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-deep"
        />
      </label>
    </div>
  );
}

function PermissionGroups({
  groupedPermissions,
  selectedPermissions,
  togglePermission,
}: {
  groupedPermissions: Record<string, Permission[]>;
  selectedPermissions: string[];
  togglePermission: (name: string) => void;
}) {
  return (
    <div className="mt-6">
      <span className="text-xs font-black text-slate-600">
        Permissions
      </span>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {Object.entries(groupedPermissions).map(([group, items]) => (
          <div
            key={group}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <h3 className="mb-3 text-xs font-black capitalize text-ink">
              {group}
            </h3>

            <div className="grid gap-2">
              {items.map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 text-xs text-slate-600 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.name)}
                    onChange={() => togglePermission(permission.name)}
                    className="h-4 w-4 accent-teal-deep"
                  />

                  {permission.name}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorBox({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
      {message}
    </div>
  );
}