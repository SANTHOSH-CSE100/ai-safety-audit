import { useCallback, useRef, useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import { useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../../src/api/client";
import { useAuthStore } from "../../src/store/authStore";
import { queryKeys } from "../../constants/queryKeys";
import type { UploadResponse } from "../../src/types/api";

type UploadState = "idle" | "uploading" | "success" | "error";

export function useVideoUploadWithProgress() {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const taskRef = useRef<FileSystem.UploadTask | null>(null);
  const queryClient = useQueryClient();

  const upload = useCallback(
    async (factoryId: string, fileUri: string, fileName: string) => {
      setState("uploading");
      setProgress(0);
      setError(null);

      const { accessToken } = useAuthStore.getState();

      try {
        const task = FileSystem.createUploadTask(
          `${API_BASE_URL}/uploads?factoryId=${factoryId}`,
          fileUri,
          {
            httpMethod: "POST",
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: "file",
            mimeType: "video/mp4",
            parameters: {},
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
          },
          (data) => {
            if (data.totalBytesExpectedToSend > 0) {
              setProgress(data.totalBytesSent / data.totalBytesExpectedToSend);
            }
          }
        );
        taskRef.current = task;

        const response = await task.uploadAsync();

        if (!response || response.status < 200 || response.status >= 300) {
          throw new Error(`Upload failed (status ${response?.status ?? "unknown"})`);
        }

        const parsed: UploadResponse = JSON.parse(response.body);
        setResult(parsed);
        setState("success");
        queryClient.invalidateQueries({ queryKey: queryKeys.uploads(factoryId) });
        return parsed;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
        setState("error");
        return null;
      }
    },
    [queryClient]
  );

  const reset = useCallback(() => {
    setState("idle");
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  return { state, progress, error, result, upload, reset };
}
