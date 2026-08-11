"""
PPE & object detector backed by Ultralytics YOLOv11.
Detects: helmet, no_helmet, safety_vest, no_vest, gloves, no_gloves, person,
fire, smoke.
"""

import numpy as np
from loguru import logger
from ultralytics import YOLO

from app.core.config import settings
from app.models.base_detector import BaseDetector, RawDetection

# Class names must match the label order the model was trained on.
PPE_CLASS_NAMES = [
    "person", "helmet", "no_helmet", "safety_vest", "no_vest",
    "gloves", "no_gloves", "fire", "smoke",
]


class PpeDetector(BaseDetector):
    def __init__(self, weights_path: str = settings.yolo_weights_path):
        self.weights_path = weights_path
        self.model: YOLO | None = None

    def warmup(self) -> None:
        logger.info(f"Loading YOLOv11 PPE model from {self.weights_path}")
        self.model = YOLO(self.weights_path)
        dummy = np.zeros((640, 640, 3), dtype=np.uint8)
        self.model.predict(dummy, verbose=False)

    def detect(self, frame: np.ndarray) -> list[RawDetection]:
        if self.model is None:
            self.warmup()

        results = self.model.track(
            frame,
            persist=True,
            conf=settings.detection_confidence_threshold,
            iou=settings.tracking_iou_threshold,
            verbose=False,
        )

        detections: list[RawDetection] = []
        for result in results:
            if result.boxes is None:
                continue
            for box in result.boxes:
                cls_id = int(box.cls[0])
                label = result.names.get(cls_id, PPE_CLASS_NAMES[cls_id] if cls_id < len(PPE_CLASS_NAMES) else "unknown")
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                track_id = int(box.id[0]) if box.id is not None else None

                detections.append(RawDetection(
                    label=label,
                    confidence=float(box.conf[0]),
                    bbox=(int(x1), int(y1), int(x2 - x1), int(y2 - y1)),
                    track_id=track_id,
                ))

        return detections
