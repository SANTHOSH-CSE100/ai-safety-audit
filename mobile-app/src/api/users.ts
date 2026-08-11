import { apiClient } from "./client";

export interface MeResponse {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "SAFETY_OFFICER" | "VIEWER";
  factoryId: string | null;
  active: boolean;
  createdAt: string;
}

export function getMe() {
  return apiClient.get<MeResponse>("/users/me");
}
