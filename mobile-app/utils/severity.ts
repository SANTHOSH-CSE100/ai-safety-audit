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
    case "LOW": return colors.infoBg;
    case "MEDIUM": return colors.warningBg;
    case "HIGH": return colors.dangerBg;
    case "CRITICAL": return colors.criticalBg;
    default: return colors.mutedBg;
  }
}

export function scoreColor(score: number): string {
  if (score >= 75) return colors.success;
  if (score >= 50) return colors.warning;
  return colors.danger;
}
