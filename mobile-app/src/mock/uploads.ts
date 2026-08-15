import type { UploadResponse } from "../types/api";
import { daysAgo, hoursAgo } from "./dates";
import { MOCK_FACTORY_CHENNAI, MOCK_FACTORY_PUNE, MOCK_FACTORY_VIZAG } from "./factories";

function upload(
  id: string,
  originalName: string,
  status: UploadResponse["status"],
  createdAt: string,
  reportId: string | null = null
): UploadResponse {
  return { id, originalName, status, reportId, createdAt };
}

/** Covers every processing state (pending/processing/completed/failed) so StatusBadge and the upload workflow are all demonstrable. */
export const mockUploadsByFactoryId: Record<string, UploadResponse[]> = {
  [MOCK_FACTORY_CHENNAI]: [
    upload("mock-upload-chennai-4", "loading-dock-forklift-check.mp4", "PROCESSING", hoursAgo(1)),
    upload("mock-upload-chennai-1", "assembly-line-3-shift-A.mp4", "COMPLETED", daysAgo(1), "mock-report-chennai-1"),
    upload("mock-upload-chennai-2", "welding-bay-inspection-0731.mp4", "COMPLETED", daysAgo(6), "mock-report-chennai-2"),
    upload("mock-upload-chennai-5", "packaging-floor-walkthrough.mp4", "FAILED", daysAgo(3)),
    upload("mock-upload-chennai-3", "warehouse-corridor-sweep.mp4", "COMPLETED", daysAgo(14), "mock-report-chennai-3"),
  ],
  [MOCK_FACTORY_PUNE]: [
    upload("mock-upload-pune-4", "press-shop-floor-cam2.mp4", "PENDING", hoursAgo(2)),
    upload("mock-upload-pune-1", "final-assembly-checkpoint.mp4", "COMPLETED", daysAgo(2), "mock-report-pune-1"),
    upload("mock-upload-pune-2", "paint-booth-inspection.mp4", "COMPLETED", daysAgo(9), "mock-report-pune-2"),
    upload("mock-upload-pune-3", "material-handling-bay.mp4", "COMPLETED", daysAgo(20), "mock-report-pune-3"),
  ],
  [MOCK_FACTORY_VIZAG]: [
    upload("mock-upload-vizag-1", "fabrication-yard-shift-B.mp4", "COMPLETED", daysAgo(3), "mock-report-vizag-1"),
    upload("mock-upload-vizag-2", "crane-operations-cam1.mp4", "COMPLETED", daysAgo(11), "mock-report-vizag-2"),
    upload("mock-upload-vizag-3", "scrap-yard-walkthrough.mp4", "FAILED", daysAgo(1)),
  ],
};

export function getMockUploads(factoryId: string): UploadResponse[] {
  return mockUploadsByFactoryId[factoryId] ?? [];
}
