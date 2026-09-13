import { API_URL } from "./client";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "won"
  | "lost";

export type Lead = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  message?: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateLeadInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
};

// Get all leads
export async function getLeads(): Promise<Lead[]> {
  const response = await fetch(`${API_URL}/leads`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  return response.json();
}

// Get single lead
export async function getLead(id: number): Promise<Lead> {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch lead");
  }

  return response.json();
}

// Public contact form
export async function createLead(
  data: CreateLeadInput,
): Promise<Lead> {
  const response = await fetch(`${API_URL}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create lead");
  }

  return response.json();
}

// Update lead status
export async function updateLeadStatus(
  id: number,
  status: LeadStatus,
): Promise<Lead> {
  const response = await fetch(`${API_URL}/leads/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update lead status");
  }

  return response.json();
}

// Delete lead
export async function deleteLead(id: number) {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.message || "Failed to delete lead",
    );
  }

  return response.json();
}