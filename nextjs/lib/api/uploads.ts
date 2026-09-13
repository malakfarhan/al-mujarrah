import { API_URL } from "./client";

export async function uploadPortfolioImage(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/uploads/portfolio`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || "Image upload failed",
    );
  }

  return result as {
    path: string;
    url: string;
  };
}