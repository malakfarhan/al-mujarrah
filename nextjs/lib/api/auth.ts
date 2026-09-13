import { API_URL } from "./client";

export type LoginInput = {
  email: string;
  password: string;
};

export async function loginAdmin(data: LoginInput) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return response.json();
}

export async function getCurrentAdmin() {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function logoutAdmin() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  return response.json();
}
