"""
RT-DETR based detector for classes that benefit from a transformer
detector's higher precision on cluttered industrial scenes: restricted-area
entry, unsafe behaviour (e.g. running, climbing on machinery), near-misses.

Uses the same Ultralytics interface as YOLO (RT-DETR is available in the
Ultralytics package as `RTDETR`).
"""

import numpy as np
from loguru import logger
from ultralytics import RTDETR

from app.core.config import settings
from app.models.base_detector import BaseDetector, RawDetection

BEHAVIOUR_CLASS_NAMES = [
    "restricted_area_entry", "running", "unsafe_climbing", "near_miss",
]


class BehaviourDetector(BaseDetector):
    def __init__(self, weights_path: str = settings.rtdetr_weights_path):
        self.weights_path = weights_path
        self.model: RTDETR | None = None

    def warmup(self) -> None:
        logger.info(f"Loading RT-DETR behaviour model from {self.weights_path}")
        self.model = RTDETR(self.weights_path)
        dummy = np.zeros((640, 640, 3), dtype=np.uint8)
        self.model.predict(dummy, verbose=False)

    def detect(self, frame: np.ndarray) -> list[RawDetection]:
        if self.model is None:
            self.warmup()

        results = self.model.predict(
            frame,
            conf=settings.detection_confidence_threshold,
            verbose=False,
        )

        detections: list[RawDetection] = []
        for result in results:
            if result.boxes is None:
                continue
            for box in result.boxes:
                cls_id = int(box.cls[0])
                label = result.names.get(
                    cls_id, BEHAVIOUR_CLASS_NAMES[cls_id] if cls_id < len(BEHAVIOUR_CLASS_NAMES) else "unknown"
                )
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                detections.append(RawDetection(
                    label=label,
                    confidence=float(box.conf[0]),
                    bbox=(int(x1), int(y1), int(x2 - x1), int(y2 - y1)),
                ))

        return detections
