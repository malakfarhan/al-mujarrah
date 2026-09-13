import { API_URL } from "./client";

export type PortfolioImage = {
  id: number;
  portfolioId: number;
  imageUrl: string;

  // English + Arabic gallery captions
  caption?: string | null;
  captionAr?: string | null;

  sortOrder: number;
  createdAt: string;
};

export type Portfolio = {
  id: number;

  // English + Arabic content
  title: string;
  titleAr?: string | null;

  slug: string;

  shortDescription?: string | null;
  shortDescriptionAr?: string | null;

  content?: string | null;
  contentAr?: string | null;

  client?: string | null;
  clientAr?: string | null;

  industry?: string | null;
  industryAr?: string | null;

  service?: string | null;
  serviceAr?: string | null;

  technologies?: string | null;
  technologiesAr?: string | null;

  coverImage?: string | null;

  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;

  metaTitle?: string | null;
  metaTitleAr?: string | null;

  metaDescription?: string | null;
  metaDescriptionAr?: string | null;

  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  images?: PortfolioImage[];
};

export type PortfolioImageInput = {
  imageUrl: string;

  // English + Arabic gallery captions
  caption?: string;
  captionAr?: string;

  sortOrder?: number;
};

export type CreatePortfolioInput = {
  // English title is required
  title: string;
  titleAr?: string;

  slug: string;

  shortDescription?: string;
  shortDescriptionAr?: string;

  content?: string;
  contentAr?: string;

  client?: string;
  clientAr?: string;

  industry?: string;
  industryAr?: string;

  service?: string;
  serviceAr?: string;

  technologies?: string;
  technologiesAr?: string;

  coverImage?: string;

  isFeatured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;

  metaTitle?: string;
  metaTitleAr?: string;

  metaDescription?: string;
  metaDescriptionAr?: string;

  images?: PortfolioImageInput[];
};

export type UpdatePortfolioInput = Partial<CreatePortfolioInput>;

// Admin: get all portfolio items
export async function getPortfolio(): Promise<Portfolio[]> {
  const response = await fetch(`${API_URL}/portfolio`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch portfolio");
  }

  return response.json();
}

// Admin: get single portfolio item
export async function getPortfolioItem(
  id: number,
): Promise<Portfolio> {
  const response = await fetch(`${API_URL}/portfolio/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch portfolio item");
  }

  return response.json();
}

// Admin: create portfolio item
export async function createPortfolio(
  data: CreatePortfolioInput,
): Promise<Portfolio> {
  const response = await fetch(`${API_URL}/portfolio`, {
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
      result?.message || "Failed to create portfolio item",
    );
  }

  return response.json();
}

// Admin: update portfolio item
export async function updatePortfolio(
  id: number,
  data: UpdatePortfolioInput,
): Promise<Portfolio> {
  const response = await fetch(`${API_URL}/portfolio/${id}`, {
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
      result?.message || "Failed to update portfolio item",
    );
  }

  return response.json();
}

// Admin: delete portfolio item
export async function deletePortfolio(id: number) {
  const response = await fetch(`${API_URL}/portfolio/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.message || "Failed to delete portfolio item",
    );
  }

  return response.json();
}

// Public: published portfolio list
export async function getPublicPortfolio(): Promise<Portfolio[]> {
  const response = await fetch(`${API_URL}/portfolio/public`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch public portfolio");
  }

  return response.json();
}

// Public: single published portfolio by slug
export async function getPublicPortfolioItem(
  slug: string,
): Promise<Portfolio> {
  const response = await fetch(
    `${API_URL}/portfolio/public/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch portfolio item");
  }

  return response.json();
}