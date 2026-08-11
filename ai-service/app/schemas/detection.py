from pydantic import BaseModel, Field


class DetectVideoRequest(BaseModel):
    video_id: str
    object_key: str  # MinIO key of the uploaded video


class Violation(BaseModel):
    type: str                  # NO_HELMET, NO_VEST, FIRE, SMOKE, RESTRICTED_AREA, NEAR_MISS, UNSAFE_BEHAVIOUR...
    confidence: float = Field(ge=0.0, le=1.0)
    timestamp_sec: float
    bbox: list[int]            # [x, y, w, h]
    track_id: int | None = None
    severity: str              # LOW, MEDIUM, HIGH, CRITICAL


class DetectVideoResponse(BaseModel):
    video_id: str
    duration_sec: float
    frames_analyzed: int
    violations: list[Violation]
    risk_score: int = Field(ge=0, le=100)
    safety_score: int = Field(ge=0, le=100)
    summary: dict[str, int]
