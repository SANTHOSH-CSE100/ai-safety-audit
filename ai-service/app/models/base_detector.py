"""
Abstraction layer so the pipeline doesn't care whether detections come from
YOLOv11, RT-DETR, or a future model. Each detector returns a list of raw
detections in a common format; violation classification happens downstream
in services/violation_engine.py.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass

import numpy as np


@dataclass
class RawDetection:
    label: str
    confidence: float
    bbox: tuple[int, int, int, int]  # x, y, w, h
    track_id: int | None = None


class BaseDetector(ABC):
    @abstractmethod
    def detect(self, frame: np.ndarray) -> list[RawDetection]:
        """Run inference on a single frame and return raw detections."""
        raise NotImplementedError

    @abstractmethod
    def warmup(self) -> None:
        """Load weights / run a dummy forward pass to avoid first-call latency."""
        raise NotImplementedError
