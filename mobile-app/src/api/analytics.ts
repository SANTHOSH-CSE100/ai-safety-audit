import { apiClient } from "./client";
import type { AnalyticsSummaryResponse } from "../types/api";

export function getAnalyticsSummary(factoryId: string, days = 30) {
  return apiClient.get<AnalyticsSummaryResponse>(`/analytics/summary?factoryId=${factoryId}&days=${days}`);
}
