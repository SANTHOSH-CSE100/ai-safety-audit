import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { API_BASE_URL } from "../api/client";
import { useAuthStore } from "../store/authStore";
import type { NotificationResponse } from "../types/api";

const WS_URL = API_BASE_URL.replace(/^http/, "ws").replace(/\/api\/v1$/, "/ws-native");

/**
 * Subscribes to live notifications for the signed-in user. Requires the
 * backend to know the user's id — since the JWT subject is the email, this
 * expects a `userId` to be available (e.g. decoded from the JWT, or fetched
 * once from a `/users/me` endpoint you add alongside this).
 */
export function useLiveNotifications(userId: string | null) {
  const [latest, setLatest] = useState<NotificationResponse | null>(null);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!userId || !accessToken) return;

    const client = new Client({
      brokerURL: WS_URL,
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe(`/topic/notifications.${userId}`, (message) => {
          setLatest(JSON.parse(message.body));
        });
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, [userId, accessToken]);

  return latest;
}
