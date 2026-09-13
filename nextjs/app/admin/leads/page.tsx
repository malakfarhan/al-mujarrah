"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Search, Trash2, X } from "lucide-react";

import AdminLoader from "@/components/admin/AdminLoader";
import {
  deleteLead,
  getLead,
  getLeads,
  updateLeadStatus,
  type Lead,
  type LeadStatus,
} from "@/lib/api/leads";

const statuses: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];
const ITEMS_PER_PAGE = 10;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  // Load newest leads first
  async function loadLeads() {
    try {
      const data = await getLeads();
      setLeads(
        [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (error) {
      console.error(error);
      setError("Unable to load leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const services = useMemo(() => {
    return Array.from(
      new Set(
        leads
          .map((lead) => lead.service)
          .filter((service): service is string => Boolean(service)),
      ),
    );
  }, [leads]);

  // Search and filters
  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone?.toLowerCase().includes(query) ||
        lead.company?.toLowerCase().includes(query) ||
        lead.service?.toLowerCase().includes(query) ||
        lead.budget?.toLowerCase().includes(query) ||
        lead.message?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      const matchesService =
        serviceFilter === "all" || lead.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [leads, search, statusFilter, serviceFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / ITEMS_PER_PAGE),
  );

  // Only show current page records
  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLeads, page]);

  // Reset pagination when search/filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, serviceFilter]);

  // Prevent invalid page after deleting records
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageNumbers = useMemo(() => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);

    return Array.from(
      { length: Math.max(0, end - start + 1) },
      (_, index) => start + index,
    );
  }, [page, totalPages]);

  async function handleView(id: number) {
    setViewOpen(true);
    setViewLoading(true);
    setSelectedLead(null);
    setError("");

    try {
      setSelectedLead(await getLead(id));
    } catch (error) {
      console.error(error);
      setError("Unable to load lead.");
      setViewOpen(false);
    } finally {
      setViewLoading(false);
    }
  }

  // Update status and show loading state until API completes
async function handleStatus(id: number, status: LeadStatus) {
  setUpdatingStatusId(id);
  setError("");

  try {
    const updatedLead = await updateLeadStatus(id, status);

    setLeads((current) =>
      current.map((lead) => (lead.id === id ? updatedLead : lead)),
    );

    setSelectedLead((current) =>
      current?.id === id ? updatedLead : current,
    );
  } catch (error) {
    console.error(error);
    setError("Unable to update lead status.");
  } finally {
    setUpdatingStatusId(null);
  }
}

  function openDelete(lead: Lead) {
    setDeletingLead(lead);
    setError("");
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!deletingLead) return;

    setDeleting(true);
    setError("");

    try {
      await deleteLead(deletingLead.id);

      setLeads((current) =>
        current.filter((lead) => lead.id !== deletingLead.id),
      );

      setDeleteOpen(false);
      setDeletingLead(null);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Unable to delete lead.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <AdminLoader
        text="Loading leads"
        subtext="Fetching latest inquiries..."
      />
    );
  }

  const firstRecord =
    filteredLeads.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;

  const lastRecord = Math.min(
    page * ITEMS_PER_PAGE,
    filteredLeads.length,
  );

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] font-black uppercase tracking-[.14em] text-teal-deep">
          Management
        </span>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          Leads & inquiries
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          All contact form submissions and sales opportunities.
        </p>
      </div>

      {error && !viewOpen && !deleteOpen && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
          {error}
        </div>
      )}

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_220px]">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, company..."
            className="h-[44px] w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-teal-deep"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-[44px] rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-deep"
        >
          <option value="all">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
            </option>
          ))}
        </select>

        <select
          value={serviceFilter}
          onChange={(event) => setServiceFilter(event.target.value)}
          className="h-[44px] rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-deep"
        >
          <option value="all">All services</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold text-slate-400">
        <span>
          {filteredLeads.length} lead
          {filteredLeads.length !== 1 ? "s" : ""}
        </span>

        {filteredLeads.length > 0 && (
          <span>
            Showing {firstRecord}-{lastRecord} of {filteredLeads.length}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {[
                  "Contact",
                  "Company",
                  "Service",
                  "Budget",
                  "Status",
                  "Date",
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
              {paginatedLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="border-b border-slate-100 px-4 py-4">
                    <strong className="block text-sm text-ink">
                      {lead.name}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      {lead.email}
                    </span>
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                    {lead.company || "—"}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                    {lead.service || "—"}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                    {lead.budget || "—"}
                  </td>

                 {/* <td className="border-b border-slate-100 px-4 py-4">
                    <select
                      value={lead.status}
                      onChange={(event) =>
                        handleStatus(
                          lead.id,
                          event.target.value as LeadStatus,
                        )
                      }
                      className={`rounded-xl border px-3 py-2 text-xs font-bold outline-none ${statusClass(lead.status)}`}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>
                  </td>*/}
                  <td className="border-b border-slate-100 px-4 py-4">
  <div className="flex items-center gap-2">
    <select
      value={lead.status}
      disabled={updatingStatusId !== null}
      onChange={(event) =>
        handleStatus(lead.id, event.target.value as LeadStatus)
      }
      className={`rounded-xl border px-3 py-2 text-xs font-bold outline-none disabled:cursor-wait disabled:opacity-60 ${statusClass(
        lead.status,
      )}`}
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {formatStatus(status)}
        </option>
      ))}
    </select>

    {updatingStatusId === lead.id && (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-[11px] font-bold text-teal-deep">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal/30 border-t-teal-deep" />
        Updating...
      </span>
    )}
  </div>
</td>

                  <td className="whitespace-nowrap border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(lead.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <Eye size={14} />
                        View
                      </button>

                      <button
                        onClick={() => openDelete(lead)}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-sm text-slate-400"
                  >
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredLeads.length > ITEMS_PER_PAGE && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-400">
            Page {page} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`grid h-[38px] min-w-[38px] place-items-center rounded-xl border px-2 text-xs font-black transition ${
                  page === pageNumber
                    ? "border-teal-deep bg-teal-deep text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page === totalPages}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {viewOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  Lead details
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Complete contact inquiry information.
                </p>
              </div>

              <button
                onClick={() => {
                  setViewOpen(false);
                  setSelectedLead(null);
                }}
                className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={17} />
              </button>
            </div>

            {viewLoading ? (
              <AdminLoader
                text="Loading lead"
                subtext="Fetching inquiry details..."
              />
            ) : (
              selectedLead && (
                <div className="mt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Detail label="Name" value={selectedLead.name} />
                    <Detail label="Email" value={selectedLead.email} />
                    <Detail label="Phone" value={selectedLead.phone} />
                    <Detail label="Company" value={selectedLead.company} />
                    <Detail label="Service" value={selectedLead.service} />
                    <Detail label="Budget" value={selectedLead.budget} />
                    <Detail
                      label="Created"
                      value={new Date(
                        selectedLead.createdAt,
                      ).toLocaleString()}
                    />

                   {/* <label className="text-xs font-bold text-slate-600">
                      Status
                      <select
                        value={selectedLead.status}
                        onChange={(event) =>
                          handleStatus(
                            selectedLead.id,
                            event.target.value as LeadStatus,
                          )
                        }
                        className="mt-2 h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-deep"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>
                    </label>*/}
                    <label className="text-xs font-bold text-slate-600">
  Status

  <div className="mt-2 flex items-center gap-3">
    <select
      value={selectedLead.status}
      disabled={updatingStatusId !== null}
      onChange={(event) =>
        handleStatus(
          selectedLead.id,
          event.target.value as LeadStatus,
        )
      }
      className="h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-deep disabled:cursor-wait disabled:opacity-60"
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {formatStatus(status)}
        </option>
      ))}
    </select>

    {updatingStatusId === selectedLead.id && (
      <span className="inline-flex shrink-0 items-center gap-2 text-[11px] font-bold text-teal-deep">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal/30 border-t-teal-deep" />
        Updating...
      </span>
    )}
  </div>
</label>
                  </div>

                  <div className="mt-5">
                    <span className="text-xs font-bold text-slate-600">
                      Message
                    </span>
                    <div className="mt-2 min-h-[120px] whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                      {selectedLead.message || "No message provided."}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {deleteOpen && deletingLead && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-[460px] rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  Delete lead
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to delete{" "}
                  <strong className="text-ink">{deletingLead.name}</strong>?
                  This action cannot be undone.
                </p>
              </div>

              <button
                onClick={() => {
                  setDeleteOpen(false);
                  setDeletingLead(null);
                  setError("");
                }}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteOpen(false);
                  setDeletingLead(null);
                  setError("");
                }}
                className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-black text-slate-600"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-5 py-3 text-xs font-black text-white disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Lead"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <div className="mt-2 min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {value || "—"}
      </div>
    </div>
  );
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusClass(status: LeadStatus) {
  switch (status) {
    case "contacted":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "qualified":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "won":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "lost":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-blue-200 bg-blue-50 text-blue-700";
  }
}