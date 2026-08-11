import { colors } from "../theme";
import type { Severity } from "../src/types/api";

export function severityColor(severity: Severity): string {
  switch (severity) {
    case "LOW": return colors.info;
    case "MEDIUM": return colors.warning;
    case "HIGH": return colors.danger;
    case "CRITICAL": return colors.critical;
    default: return colors.muted;
  }
}

export function severityBg(severity: Severity): string {
  switch (severity) {
    case "LOW": return "#EFF6FF";
    case "MEDIUM": return "#FFFBEB";
    case "HIGH": return "#FEF2F2";
    case "CRITICAL": return "#FEE2E2";
    default: return "#F3F4F6";
  }
}

export function scoreColor(score: number): string {
  if (score >= 75) return colors.success;
  if (score >= 50) return colors.warning;
  return colors.danger;
}
