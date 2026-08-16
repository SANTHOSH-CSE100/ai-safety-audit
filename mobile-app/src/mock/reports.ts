import type { ReportDetailResponse, ViolationResponse } from "../types/api";
import { violation } from "./violations";
import { daysAgo } from "./dates";
import { MOCK_FACTORY_CHENNAI, MOCK_FACTORY_PUNE, MOCK_FACTORY_VIZAG } from "./factories";

function summarize(violations: ViolationResponse[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const v of violations) summary[v.type] = (summary[v.type] ?? 0) + 1;
  return summary;
}

/** Mirrors the backend's four mock-analysis audit templates (see MockAiAnalysisService) so demo reports read the same way as backend-generated ones. */
function titleFor(violations: ViolationResponse[]): string {
  if (violations.length === 0) return "General Factory Safety Audit";
  const types = new Set(violations.map((v) => v.type));
  if (types.has("FORKLIFT_PROXIMITY") || types.has("UNAUTHORIZED_ZONE_ENTRY") || types.has("BLOCKED_FIRE_EXIT")) {
    return "Restricted Zone Audit";
  }
  if (types.has("NO_HELMET") || types.has("MISSING_GLOVES") || types.has("NO_SAFETY_VEST")) {
    return "PPE Compliance Audit";
  }
  if (types.has("UNSAFE_LADDER_USE") || types.has("MISSING_GUARD_RAIL")) {
    return "Machinery Safety Audit";
  }
  return "General Factory Safety Audit";
}

const RECOMMENDATION_BY_TYPE: Record<string, string> = {
  NO_HELMET: "Provide refresher training on mandatory PPE before floor access.",
  NO_SAFETY_VEST: "Reinforce high-visibility vest requirements at shift start.",
  MISSING_GLOVES: "Restock glove dispensers near high-traffic zones.",
  NO_EAR_PROTECTION: "Enforce hearing protection in high-noise zones.",
  UNAUTHORIZED_ZONE_ENTRY: "Install physical barriers around restricted-zone entry points.",
  FORKLIFT_PROXIMITY: "Add proximity sensors with audible alerts near forklifts.",
  BLOCKED_FIRE_EXIT: "Keep fire exits clear at all times — schedule daily checks.",
  UNSAFE_LADDER_USE: "Retrain staff on ladder safety and inspection procedures.",
  MISSING_GUARD_RAIL: "Install guard rails at all elevated work platforms.",
  SPILL_NOT_CONTAINED: "Deploy spill-response kits at material handling bays.",
};

function recommendationsFor(violations: ViolationResponse[]): string[] {
  const recs = violations.map((v) => RECOMMENDATION_BY_TYPE[v.type]).filter((r): r is string => !!r);
  const unique = Array.from(new Set(recs));
  return unique.length > 0 ? unique : ["No corrective action required — maintain current safety practices."];
}

function report(
  id: string,
  uploadId: string,
  safetyScore: number,
  createdAt: string,
  violations: ViolationResponse[]
): ReportDetailResponse {
  return {
    id,
    uploadId,
    title: titleFor(violations),
    safetyScore,
    riskScore: Math.max(0, 100 - safetyScore),
    summary: summarize(violations),
    violations,
    recommendations: recommendationsFor(violations),
    createdAt,
  };
}

/**
 * A handful of reports per factory spanning every quality tier the design
 * spec calls out — excellent, good, needs attention, critical — so every
 * visual state (ScoreRing color, SeverityBadge, empty-violations state) can
 * be seen without needing real backend data.
 */
export const mockReportsByFactoryId: Record<string, ReportDetailResponse[]> = {
  [MOCK_FACTORY_CHENNAI]: [
    report("mock-report-chennai-1", "mock-upload-chennai-1", 96, daysAgo(1), [
      violation("NO_EAR_PROTECTION", "LOW", 42, 0.81),
    ]),
    report("mock-report-chennai-2", "mock-upload-chennai-2", 63, daysAgo(6), [
      violation("NO_HELMET", "HIGH", 18, 0.94),
      violation("MISSING_GLOVES", "MEDIUM", 55, 0.88),
      violation("UNAUTHORIZED_ZONE_ENTRY", "MEDIUM", 121, 0.79),
    ]),
    report("mock-report-chennai-3", "mock-upload-chennai-3", 38, daysAgo(14), [
      violation("FORKLIFT_PROXIMITY", "CRITICAL", 9, 0.97),
      violation("BLOCKED_FIRE_EXIT", "HIGH", 76, 0.91),
      violation("NO_HELMET", "HIGH", 140, 0.93),
      violation("NO_SAFETY_VEST", "MEDIUM", 168, 0.85),
    ]),
  ],
  [MOCK_FACTORY_PUNE]: [
    report("mock-report-pune-1", "mock-upload-pune-1", 85, daysAgo(2), [
      violation("NO_SAFETY_VEST", "LOW", 31, 0.77),
      violation("MISSING_GUARD_RAIL", "MEDIUM", 98, 0.86),
    ]),
    report("mock-report-pune-2", "mock-upload-pune-2", 94, daysAgo(9), [
      violation("NO_EAR_PROTECTION", "LOW", 22, 0.72),
    ]),
    report("mock-report-pune-3", "mock-upload-pune-3", 68, daysAgo(20), [
      violation("UNSAFE_LADDER_USE", "HIGH", 47, 0.9),
      violation("SPILL_NOT_CONTAINED", "MEDIUM", 133, 0.83),
      violation("NO_EAR_PROTECTION", "LOW", 5, 0.68),
    ]),
  ],
  [MOCK_FACTORY_VIZAG]: [
    report("mock-report-vizag-1", "mock-upload-vizag-1", 41, daysAgo(3), [
      violation("FORKLIFT_PROXIMITY", "CRITICAL", 14, 0.96),
      violation("BLOCKED_FIRE_EXIT", "CRITICAL", 60, 0.95),
      violation("NO_HELMET", "HIGH", 102, 0.89),
    ]),
    report("mock-report-vizag-2", "mock-upload-vizag-2", 82, daysAgo(11), [
      violation("MISSING_GLOVES", "MEDIUM", 40, 0.84),
      violation("NO_SAFETY_VEST", "LOW", 88, 0.75),
    ]),
  ],
};

const allMockReports = Object.values(mockReportsByFactoryId).flat();

export function getMockReports(factoryId: string): ReportDetailResponse[] {
  return mockReportsByFactoryId[factoryId] ?? [];
}

export function getMockReport(reportId: string): ReportDetailResponse | undefined {
  return allMockReports.find((r) => r.id === reportId);
}
