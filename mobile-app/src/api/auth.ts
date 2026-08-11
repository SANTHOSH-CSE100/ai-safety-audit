import { apiClient } from "./client";
import { useAuthStore } from "../store/authStore";
import type { AuthResponse } from "../types/api";

export async function login(email: string, password: string) {
  const auth = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  await useAuthStore.getState().setAuth(auth);
  return auth;
}

export async function logout() {
  await useAuthStore.getState().logout();
}

export async function forgotPassword(email: string) {
  return apiClient.post<{ message: string }>("/auth/forgot-password", { email });
}
