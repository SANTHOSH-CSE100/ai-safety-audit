from loguru import logger

from app.models.behaviour_detector import BehaviourDetector
from app.models.ppe_detector import PpeDetector
from app.pipeline.frame_extraction import FrameExtractor
from app.schemas.detection import DetectVideoResponse, Violation
from app.services.scoring import ScoringService
from app.services.violation_engine import ViolationEngine


class DetectionPipeline:
    def __init__(self):
        self.frame_extractor = FrameExtractor()
        self.ppe_detector = PpeDetector()
        self.behaviour_detector = BehaviourDetector()
        self.violation_engine = ViolationEngine()
        self.scoring_service = ScoringService()

    def warmup(self) -> None:
        self.ppe_detector.warmup()
        self.behaviour_detector.warmup()

    def run(self, video_id: str, video_path: str) -> DetectVideoResponse:
        logger.info(f"Starting detection pipeline for video_id={video_id}")

        duration_sec = self.frame_extractor.get_duration_sec(video_path)
        all_violations: list[Violation] = []
        frames_analyzed = 0

        for timestamp_sec, frame in self.frame_extractor.extract(video_path):
            frames_analyzed += 1

            ppe_detections = self.ppe_detector.detect(frame)
            behaviour_detections = self.behaviour_detector.detect(frame)

            all_violations.extend(self.violation_engine.classify(ppe_detections, timestamp_sec))
            all_violations.extend(self.violation_engine.classify(behaviour_detections, timestamp_sec))

        risk_score, safety_score, summary = self.scoring_service.score(all_violations)

        logger.info(
            f"Pipeline complete for video_id={video_id}: "
            f"{frames_analyzed} frames, {len(all_violations)} violations, risk={risk_score}"
        )

        return DetectVideoResponse(
            video_id=video_id,
            duration_sec=round(duration_sec, 2),
            frames_analyzed=frames_analyzed,
            violations=all_violations,
            risk_score=risk_score,
            safety_score=safety_score,
            summary=summary,
        )
