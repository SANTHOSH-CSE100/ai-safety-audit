import type { Severity, ViolationResponse } from "../types/api";

/** Realistic industrial safety violation types — matches formatViolationType()'s SNAKE_CASE -> Title Case convention. */
export const VIOLATION_TYPES = [
  "NO_HELMET",
  "NO_SAFETY_VEST",
  "MISSING_GLOVES",
  "NO_EAR_PROTECTION",
  "UNAUTHORIZED_ZONE_ENTRY",
  "FORKLIFT_PROXIMITY",
  "BLOCKED_FIRE_EXIT",
  "UNSAFE_LADDER_USE",
  "MISSING_GUARD_RAIL",
  "SPILL_NOT_CONTAINED",
] as const;

let seq = 0;
function nextId(): string {
  seq += 1;
  return `mock-violation-${seq}`;
}

export function violation(
  type: (typeof VIOLATION_TYPES)[number],
  severity: Severity,
  timestampSec: number,
  confidence = 0.9
): ViolationResponse {
  return {
    id: nextId(),
    type,
    severity,
    confidence,
    timestampSec,
    trackId: Math.floor(Math.random() * 12) + 1,
  };
}
