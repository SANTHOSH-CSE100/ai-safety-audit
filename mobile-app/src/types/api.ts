export type Role = "ADMIN" | "SAFETY_OFFICER" | "VIEWER";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
  role: Role;
}

export type UploadStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface UploadResponse {
  id: string;
  originalName: string;
  status: UploadStatus;
  reportId: string | null;
  createdAt: string;
}

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ViolationResponse {
  id: string;
  type: string;
  severity: Severity;
  confidence: number;
  timestampSec: number;
  trackId: number | null;
}

export interface ReportDetailResponse {
  id: string;
  uploadId: string;
  riskScore: number;
  safetyScore: number;
  summary: Record<string, number>;
  violations: ViolationResponse[];
  createdAt: string;
}

export interface NotificationResponse {
  id: string;
  title: string;
  body: string | null;
  read: boolean;
  relatedReportId: string | null;
  createdAt: string;
}

export interface AnalyticsSummaryResponse {
  totalUploadsLast30Days: number;
  totalViolationsLast30Days: number;
  avgSafetyScoreLast30Days: number;
  violationBreakdown: Record<string, number>;
  trend: { date: string; uploads: number; violations: number; avgSafetyScore: number }[];
}

export interface FactoryResponse {
  id: string;
  name: string;
  location: string | null;
  timezone: string;
  createdAt: string;
}

export interface UploadStatusEvent {
  uploadId: string;
  status: UploadStatus;
}
