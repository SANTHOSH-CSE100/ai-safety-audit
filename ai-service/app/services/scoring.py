from collections import Counter

from app.schemas.detection import Violation

SEVERITY_WEIGHTS = {
    "LOW": 2,
    "MEDIUM": 5,
    "HIGH": 10,
    "CRITICAL": 20,
}


class ScoringService:
    """Converts a list of violations into risk_score / safety_score (0-100)
    and a per-type summary count."""

    def score(self, violations: list[Violation]) -> tuple[int, int, dict[str, int]]:
        if not violations:
            return 0, 100, {}

        raw_risk = sum(SEVERITY_WEIGHTS[v.severity] * v.confidence for v in violations)
        risk_score = min(100, round(raw_risk))
        safety_score = max(0, 100 - risk_score)

        summary = Counter(v.type for v in violations)

        return risk_score, safety_score, dict(summary)
