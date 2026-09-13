"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Pencil,
  Plus,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";

import AdminLoader from "@/components/admin/AdminLoader";

import {
  createAdmin,
  getAdmins,
  updateAdmin,
  type AdminUser,
} from "@/lib/api/admins";

import {
  getRoles,
  type Role,
} from "@/lib/api/roles";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [editingAdmin, setEditingAdmin] =
    useState<AdminUser | null>(null);

  const [createRoleIds, setCreateRoleIds] =
    useState<number[]>([]);

  const [editRoleIds, setEditRoleIds] =
    useState<number[]>([]);

  // Create admin status
  const [createStatus, setCreateStatus] = useState(true);

  // Edit admin status
  const [editStatus, setEditStatus] = useState(true);

  const [error, setError] = useState("");

  // Load admins and roles
  async function loadData() {
    try {
      const [adminsData, rolesData] = await Promise.all([
        getAdmins(),
        getRoles(),
      ]);

      setAdmins(adminsData);
      setRoles(rolesData);
    } catch (error) {
      console.error(error);
      setError("Unable to load admin users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Toggle create roles
  function toggleCreateRole(roleId: number) {
    setCreateRoleIds((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId],
    );
  }

  // Toggle edit roles
  function toggleEditRole(roleId: number) {
    setEditRoleIds((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId],
    );
  }

  // Create admin
  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setCreating(true);
    setError("");

    try {
      const newAdmin = await createAdmin({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        roleIds: createRoleIds,
        isActive: createStatus,
      });

      // Show new admin instantly
      setAdmins((current) => [...current, newAdmin]);

      form.reset();
      setCreateRoleIds([]);
      setCreateStatus(true);
      setCreateOpen(false);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create admin.",
      );
    } finally {
      setCreating(false);
    }
  }

  // Open edit modal
  function handleEdit(admin: AdminUser) {
    setEditingAdmin(admin);

    // Existing roles
    setEditRoleIds(
      admin.roles.map((role) => role.id),
    );

    // Existing active/inactive status
    setEditStatus(admin.isActive);

    setError("");
    setEditOpen(true);
  }

  // Update admin
  async function handleUpdate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!editingAdmin) return;

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const isSuperAdmin = editingAdmin.roles.some(
      (role) => role.name.trim() === "super_admin",
    );

    setUpdating(true);
    setError("");

    try {
      const payload: {
        name: string;
        email: string;
        password?: string;
        roleIds?: number[];
        isActive?: boolean;
      } = {
        name,
        email,
      };

      // Password only when changed
      if (password.trim()) {
        payload.password = password;
      }

      // Protect super_admin roles/status
      if (!isSuperAdmin) {
        payload.roleIds = editRoleIds;
        payload.isActive = editStatus;
      }

      await updateAdmin(
        editingAdmin.id,
        payload,
      );

      const updatedRoles = isSuperAdmin
        ? editingAdmin.roles
        : roles
            .filter((role) =>
              editRoleIds.includes(role.id),
            )
            .map((role) => ({
              id: role.id,
              name: role.name,
            }));

      // Update table instantly
      setAdmins((current) =>
        current.map((admin) =>
          admin.id === editingAdmin.id
            ? {
                ...admin,
                name,
                email,
                roles: updatedRoles,
                isActive: isSuperAdmin
                  ? admin.isActive
                  : editStatus,
              }
            : admin,
        ),
      );

      setEditOpen(false);
      setEditingAdmin(null);
      setEditRoleIds([]);
      setEditStatus(true);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update admin.",
      );
    } finally {
      setUpdating(false);
    }
  }

  // Activate / deactivate from table
  async function handleStatus(admin: AdminUser) {
    const isSuperAdmin = admin.roles.some(
      (role) => role.name.trim() === "super_admin",
    );

    if (isSuperAdmin) return;

    setError("");

    try {
      const newStatus = !admin.isActive;

      await updateAdmin(admin.id, {
        isActive: newStatus,
      });

      // Update instantly
      setAdmins((current) =>
        current.map((item) =>
          item.id === admin.id
            ? {
                ...item,
                isActive: newStatus,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to change admin status.",
      );
    }
  }

  function closeCreate() {
    setCreateOpen(false);
    setCreateRoleIds([]);
    setCreateStatus(true);
    setError("");
  }

  function closeEdit() {
    setEditOpen(false);
    setEditingAdmin(null);
    setEditRoleIds([]);
    setEditStatus(true);
    setError("");
  }

  if (loading) {
    return (
      <AdminLoader
        text="Loading admins"
        subtext="Fetching admin users and roles..."
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
            Admin users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage admin accounts, roles and access status.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateRoleIds([]);
            setCreateStatus(true);
            setError("");
            setCreateOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-xs font-black text-white"
        >
          <Plus size={16} />
          Add Admin
        </button>
      </div>

      {error && !createOpen && !editOpen && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {[
                  "Admin",
                  "Roles",
                  "Status",
                  "Last Login",
                  "Created",
                  "Action",
                ].map((item) => (
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
              {admins.map((admin) => {
                const isSuperAdmin = admin.roles.some(
                  (role) =>
                    role.name.trim() === "super_admin",
                );

                return (
                  <tr key={admin.id}>
                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf9f6] text-teal-deep">
                          <Users size={17} />
                        </span>

                        <div>
                          <strong className="block text-sm text-ink">
                            {admin.name}
                          </strong>

                          <span className="text-xs text-slate-400">
                            {admin.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {admin.roles.map((role) => (
                          <span
                            key={role.id}
                            className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600"
                          >
                            {role.name.trim()}
                          </span>
                        ))}

                        {admin.roles.length === 0 && (
                          <span className="text-xs text-slate-400">
                            No role
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ${
                          admin.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {admin.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4 text-xs text-slate-500">
                      {admin.lastLoginAt
                        ? new Date(
                            admin.lastLoginAt,
                          ).toLocaleString()
                        : "Never"}
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4 text-xs text-slate-500">
                      {new Date(
                        admin.createdAt,
                      ).toLocaleDateString()}
                    </td>

                    <td className="border-b border-slate-100 px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleEdit(admin)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          disabled={isSuperAdmin}
                          onClick={() =>
                            handleStatus(admin)
                          }
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${
                            admin.isActive
                              ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {admin.isActive ? (
                            <UserX size={14} />
                          ) : (
                            <UserCheck size={14} />
                          )}

                          {admin.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {admins.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-sm text-slate-400"
                  >
                    No admin users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <ModalHeader
              title="Add admin"
              description="Create a new admin account and assign access."
              onClose={closeCreate}
            />

            <form onSubmit={handleCreate}>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  name="name"
                  placeholder="Sales Manager"
                  required
                />

                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="sales@almajrah.com"
                  required
                />

                <Field
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  required
                />

                <StatusField
                  value={createStatus}
                  onChange={setCreateStatus}
                />
              </div>

              <RoleSelector
                roles={roles}
                selectedRoleIds={createRoleIds}
                toggleRole={toggleCreateRole}
              />

              {error && <ErrorBox message={error} />}

              <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeCreate}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-ink px-5 py-3 text-xs font-black text-white disabled:opacity-60"
                >
                  {creating
                    ? "Creating..."
                    : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editOpen && editingAdmin && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <ModalHeader
              title="Edit admin"
              description="Update account information, status and assigned roles."
              onClose={closeEdit}
            />

            <form onSubmit={handleUpdate}>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  name="name"
                  defaultValue={editingAdmin.name}
                  required
                />

                <Field
                  label="Email"
                  name="email"
                  type="email"
                  defaultValue={editingAdmin.email}
                  required
                />

                <Field
                  label="New password"
                  name="password"
                  type="password"
                  placeholder="Leave blank to keep current"
                />

                <StatusField
                  value={editStatus}
                  onChange={setEditStatus}
                  disabled={editingAdmin.roles.some(
                    (role) =>
                      role.name.trim() ===
                      "super_admin",
                  )}
                />
              </div>

              {!editingAdmin.roles.some(
                (role) =>
                  role.name.trim() === "super_admin",
              ) && (
                <RoleSelector
                  roles={roles}
                  selectedRoleIds={editRoleIds}
                  toggleRole={toggleEditRole}
                />
              )}

              {editingAdmin.roles.some(
                (role) =>
                  role.name.trim() === "super_admin",
              ) && (
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-500">
                  <ShieldCheck size={15} />
                  super_admin role and status are protected.
                </div>
              )}

              {error && <ErrorBox message={error} />}

              <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-xl bg-ink px-5 py-3 text-xs font-black text-white disabled:opacity-60"
                >
                  {updating
                    ? "Updating..."
                    : "Update Admin"}
                </button>
              </div>
            </form>
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
    <div className="flex items-start justify-between gap-4">
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
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
      >
        <X size={17} />
      </button>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="text-xs font-bold text-slate-600">
      {label}

      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 h-[46px] w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-deep"
      />
    </label>
  );
}

function StatusField({
  value,
  onChange,
  disabled = false,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="text-xs font-bold text-slate-600">
      Status

      <select
        value={value ? "active" : "inactive"}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target.value === "active",
          )
        }
        className="mt-2 h-[46px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-teal-deep disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      >
        <option value="active">
          Active
        </option>

        <option value="inactive">
          Inactive
        </option>
      </select>
    </label>
  );
}

function RoleSelector({
  roles,
  selectedRoleIds,
  toggleRole,
}: {
  roles: Role[];
  selectedRoleIds: number[];
  toggleRole: (roleId: number) => void;
}) {
  return (
    <div className="mt-6">
      <div>
        <span className="text-xs font-black text-slate-600">
          Assign Roles
        </span>

        <p className="mt-1 text-[11px] text-slate-400">
          Select one or more roles for this admin.
        </p>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {roles.map((role) => (
          <label
            key={role.id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-xs font-bold transition ${
              selectedRoleIds.includes(role.id)
                ? "border-teal-deep bg-[#edf9f6] text-teal-deep"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedRoleIds.includes(
                role.id,
              )}
              onChange={() =>
                toggleRole(role.id)
              }
              className="h-4 w-4 accent-teal-deep"
            />

            {role.name.trim()}
          </label>
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