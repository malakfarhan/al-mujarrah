import { API_URL } from "./client";

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export type ProjectPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type Project = {
  id: number;
  projectNo: string;
  quotationId?: number | null;

  clientName: string;
  clientNameAr?: string | null;

  company?: string | null;
  companyAr?: string | null;

  title: string;
  titleAr?: string | null;

  description?: string | null;
  descriptionAr?: string | null;

  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;

  budget: number;
  currency: string;

  startDate?: string | null;
  dueDate?: string | null;

  notes?: string | null;
  notesAr?: string | null;

  createdAt: string;
  updatedAt: string;
};

export type CreateProjectInput = {
  quotationId?: number;

  // Optional because accepted quotation can provide these values.
  clientName?: string;
  clientNameAr?: string;

  company?: string;
  companyAr?: string;

  title?: string;
  titleAr?: string;

  description?: string;
  descriptionAr?: string;

  status?: ProjectStatus;
  priority?: ProjectPriority;
  progress?: number;

  budget?: number;
  currency?: string;

  startDate?: string;
  dueDate?: string;

  notes?: string;
  notesAr?: string;
};

export type UpdateProjectInput = {
  quotationId?: number;

  clientName?: string;
  clientNameAr?: string;

  company?: string;
  companyAr?: string;

  title?: string;
  titleAr?: string;

  description?: string;
  descriptionAr?: string;

  status?: ProjectStatus;
  priority?: ProjectPriority;
  progress?: number;

  budget?: number;
  currency?: string;

  startDate?: string;
  dueDate?: string;

  notes?: string;
  notesAr?: string;
};

// Get all projects
export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/projects`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

// Get single project
export async function getProject(id: number): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
}

// Create project
export async function createProject(
  data: CreateProjectInput,
): Promise<Project> {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || "Failed to create project");
  }

  return response.json();
}

// Update project
export async function updateProject(
  id: number,
  data: UpdateProjectInput,
): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || "Failed to update project");
  }

  return response.json();
}

// Delete project
export async function deleteProject(id: number) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || "Failed to delete project");
  }

  return response.json();
}