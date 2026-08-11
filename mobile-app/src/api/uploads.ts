import { apiClient } from "./client";
import type { UploadResponse } from "../types/api";

export function listUploads(factoryId: string) {
  return apiClient.get<UploadResponse[]>(`/uploads?factoryId=${factoryId}`);
}

export function getUpload(uploadId: string) {
  return apiClient.get<UploadResponse>(`/uploads/${uploadId}`);
}

/**
 * Uploads a video captured/picked in the app (e.g. via expo-image-picker /
 * expo-camera). `fileUri` is the local file:// URI from the picker result.
 */
export function uploadVideo(factoryId: string, fileUri: string, fileName: string) {
  const form = new FormData();
  form.append("factoryId", factoryId);
  // React Native's FormData accepts this shape for file uploads.
  form.append("file", {
    uri: fileUri,
    name: fileName,
    type: "video/mp4",
  } as unknown as Blob);

  return apiClient.postForm<UploadResponse>("/uploads", form);
}
