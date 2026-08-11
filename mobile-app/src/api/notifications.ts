import { apiClient } from "./client";
import type { NotificationResponse } from "../types/api";

export function listNotifications() {
  return apiClient.get<NotificationResponse[]>("/notifications");
}

export function getUnreadCount() {
  return apiClient.get<{ count: number }>("/notifications/unread-count");
}

export function markNotificationRead(id: string) {
  return apiClient.patch<NotificationResponse>(`/notifications/${id}/read`);
}
