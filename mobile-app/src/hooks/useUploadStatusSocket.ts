import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { API_BASE_URL } from "../api/client";
import type { UploadStatus, UploadStatusEvent } from "../types/api";

// Native (non-SockJS) STOMP endpoint — see backend WebSocketConfig#/ws-native.
const WS_URL = API_BASE_URL.replace(/^http/, "ws").replace(/\/api\/v1$/, "/ws-native");

/**
 * Subscribes to live processing-status updates for a single upload.
 * Falls back gracefully if the socket can't connect — callers should still
 * poll `getUpload(id)` occasionally as a backstop.
 *
 * Requires: npm install @stomp/stompjs
 */
export function useUploadStatusSocket(uploadId: string | null) {
  const [status, setStatus] = useState<UploadStatus | null>(null);

  useEffect(() => {
    if (!uploadId) return;

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe(`/topic/uploads.${uploadId}.status`, (message) => {
          const event: UploadStatusEvent = JSON.parse(message.body);
          setStatus(event.status);
        });
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, [uploadId]);

  return status;
}
