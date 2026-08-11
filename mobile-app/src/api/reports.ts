import { apiClient } from "./client";
import type { ReportDetailResponse } from "../types/api";
import { API_BASE_URL } from "./client";

export function listReports(factoryId: string) {
  return apiClient.get<ReportDetailResponse[]>(`/reports?factoryId=${factoryId}`);
}

export function getReport(reportId: string) {
  return apiClient.get<ReportDetailResponse>(`/reports/${reportId}`);
}

/** Returns the download endpoint — pass the current access token as an Authorization header when fetching (see usePdfDownload). */
export function getReportPdfUrl(reportId: string) {
  return `${API_BASE_URL}/reports/${reportId}/export`;
}
