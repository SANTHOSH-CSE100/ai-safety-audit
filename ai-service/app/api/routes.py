import os

from fastapi import APIRouter, HTTPException
from loguru import logger

from app.pipeline.detection_pipeline import DetectionPipeline
from app.schemas.detection import DetectVideoRequest, DetectVideoResponse
from app.utils.storage_client import ObjectStorageClient

router = APIRouter()

pipeline = DetectionPipeline()
storage = ObjectStorageClient()


@router.post("/detect/video", response_model=DetectVideoResponse)
def detect_video(request: DetectVideoRequest) -> DetectVideoResponse:
    """
    Called by the Spring Boot backend after a video is uploaded.
    Downloads the video from object storage, runs the full detection
    pipeline, and returns structured violation/risk data synchronously.
    (For very long videos, swap this for a background task + webhook.)
    """
    try:
        local_path = storage.download_to_temp(request.object_key)
    except Exception as exc:
        logger.error(f"Failed to download {request.object_key}: {exc}")
        raise HTTPException(status_code=404, detail="Could not retrieve video from storage") from exc

    try:
        result = pipeline.run(video_id=request.video_id, video_path=local_path)
        return result
    except Exception as exc:
        logger.exception(f"Detection pipeline failed for {request.video_id}")
        raise HTTPException(status_code=500, detail=f"Detection failed: {exc}") from exc
    finally:
        if os.path.exists(local_path):
            os.remove(local_path)


@router.get("/health")
def health():
    return {"status": "ok"}
