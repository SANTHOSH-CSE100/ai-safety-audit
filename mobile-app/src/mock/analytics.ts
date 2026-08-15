import type { AnalyticsSummaryResponse } from "../types/api";
import { getMockReports } from "./reports";
import { MOCK_FACTORY_CHENNAI } from "./factories";

/** A gentle sine-based wobble so the trend line looks organic instead of a flat mock, without relying on Math.random() (which would re-shuffle on every refetch). */
function wobble(dayIndex: number, amplitude: number, period: number): number {
  return Math.sin(dayIndex / period) * amplitude;
}

export function buildMockAnalytics(factoryId: string, days: number): AnalyticsSummaryResponse {
  const baseScore = factoryId === MOCK_FACTORY_CHENNAI ? 84 : 88;

  const trend = Array.from({ length: days }, (_, i) => {
    const dayIndex = days - 1 - i; // oldest first
    const date = new Date();
    date.setDate(date.getDate() - dayIndex);

    const avgSafetyScore = Math.max(35, Math.min(99, Math.round(baseScore + wobble(dayIndex, 8, 4))));
    const uploads = Math.max(0, Math.round(1 + wobble(dayIndex, 1.2, 3)));
    const violations = Math.max(0, Math.round((100 - avgSafetyScore) / 20 + wobble(dayIndex, 0.8, 5)));

    return { date: date.toISOString().slice(0, 10), uploads, violations, avgSafetyScore };
  });

  const totalUploadsLast30Days = trend.reduce((sum, t) => sum + t.uploads, 0);
  const totalViolationsLast30Days = trend.reduce((sum, t) => sum + t.violations, 0);
  const avgSafetyScoreLast30Days = Math.round(
    trend.reduce((sum, t) => sum + t.avgSafetyScore, 0) / trend.length
  );

  const violationBreakdown: Record<string, number> = {};
  for (const r of getMockReports(factoryId)) {
    for (const [type, count] of Object.entries(r.summary)) {
      violationBreakdown[type] = (violationBreakdown[type] ?? 0) + count;
    }
  }

  return {
    totalUploadsLast30Days,
    totalViolationsLast30Days,
    avgSafetyScoreLast30Days,
    violationBreakdown,
    trend,
  };
}
