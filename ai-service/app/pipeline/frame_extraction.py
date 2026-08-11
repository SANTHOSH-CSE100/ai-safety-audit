"""Extracts frames from video at a fixed sampling rate for analysis."""

import cv2
from loguru import logger

from app.core.config import settings


class FrameExtractor:
    def __init__(self, sample_fps: float = settings.frame_sample_fps):
        self.sample_fps = sample_fps

    def extract(self, video_path: str):
        """Yields (timestamp_sec, frame) tuples sampled at self.sample_fps."""
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise RuntimeError(f"Could not open video: {video_path}")

        native_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        frame_interval = max(1, round(native_fps / self.sample_fps))

        frame_idx = 0
        logger.info(f"Extracting frames every {frame_interval} frames (native fps={native_fps:.1f})")

        while True:
            ok, frame = cap.read()
            if not ok:
                break

            if frame_idx % frame_interval == 0:
                timestamp_sec = frame_idx / native_fps
                yield timestamp_sec, frame

            frame_idx += 1

        cap.release()

    def get_duration_sec(self, video_path: str) -> float:
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        cap.release()
        return frame_count / fps if fps else 0.0
