from app.models.base_detector import RawDetection
from app.schemas.detection import Violation

# label -> (violation_type, severity)
VIOLATION_MAP: dict[str, tuple[str, str]] = {
    "no_helmet": ("NO_HELMET", "HIGH"),
    "no_vest": ("NO_VEST", "MEDIUM"),
    "no_gloves": ("NO_GLOVES", "LOW"),
    "fire": ("FIRE", "CRITICAL"),
    "smoke": ("SMOKE", "CRITICAL"),
    "restricted_area_entry": ("RESTRICTED_AREA", "HIGH"),
    "running": ("UNSAFE_BEHAVIOUR", "MEDIUM"),
    "unsafe_climbing": ("UNSAFE_BEHAVIOUR", "HIGH"),
    "near_miss": ("NEAR_MISS", "CRITICAL"),
}


class ViolationEngine:
    """Turns raw per-frame detections into the platform's violation taxonomy."""

    def classify(self, detections: list[RawDetection], timestamp_sec: float) -> list[Violation]:
        violations: list[Violation] = []

        for det in detections:
            mapping = VIOLATION_MAP.get(det.label)
            if mapping is None:
                continue  # not a violation class (e.g. "person", "helmet")

            violation_type, severity = mapping
            violations.append(Violation(
                type=violation_type,
                confidence=round(det.confidence, 3),
                timestamp_sec=round(timestamp_sec, 2),
                bbox=list(det.bbox),
                track_id=det.track_id,
                severity=severity,
            ))

        return violations
