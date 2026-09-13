import { API_URL } from "./client";

export type Blog = {
  id: number;

  title: string;
  titleAr?: string | null;
  slug: string;

  excerpt?: string | null;
  excerptAr?: string | null;

  content?: string | null;
  contentAr?: string | null;

  category?: string | null;
  categoryAr?: string | null;

  coverImage?: string | null;

  isFeatured: boolean;
  isPublished: boolean;

  metaTitle?: string | null;
  metaTitleAr?: string | null;

  metaDescription?: string | null;
  metaDescriptionAr?: string | null;

  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBlogInput = {
  title: string;
  titleAr?: string;
  slug: string;

  excerpt?: string;
  excerptAr?: string;

  content?: string;
  contentAr?: string;

  category?: string;
  categoryAr?: string;

  coverImage?: string;

  isFeatured?: boolean;
  isPublished?: boolean;

  metaTitle?: string;
  metaTitleAr?: string;

  metaDescription?: string;
  metaDescriptionAr?: string;
};

export type UpdateBlogInput = Partial<CreateBlogInput>;

// Admin: get all blog posts
export async function getBlogs(): Promise<Blog[]> {
  const response = await fetch(`${API_URL}/blog`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog posts");
  }

  return response.json();
}

// Admin: get single blog post
export async function getBlog(id: number): Promise<Blog> {
  const response = await fetch(`${API_URL}/blog/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog post");
  }

  return response.json();
}

// Admin: create blog post
export async function createBlog(data: CreateBlogInput): Promise<Blog> {
  const response = await fetch(`${API_URL}/blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || "Failed to create blog post");
  }

  return response.json();
}

// Admin: update blog post
export async function updateBlog(
  id: number,
  data: UpdateBlogInput,
): Promise<Blog> {
  const response = await fetch(`${API_URL}/blog/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || "Failed to update blog post");
  }

  return response.json();
}

// Admin: delete blog post
export async function deleteBlog(id: number) {
  const response = await fetch(`${API_URL}/blog/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || "Failed to delete blog post");
  }

  return response.json();
}

// Public: published blog posts
export async function getPublicBlogs(): Promise<Blog[]> {
  const response = await fetch(`${API_URL}/blog/public`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch blog posts");
  }

  return response.json();
}

// Public: published blog post by slug
export async function getPublicBlog(slug: string): Promise<Blog> {
  const response = await fetch(
    `${API_URL}/blog/public/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch blog post");
  }

  return response.json();
}