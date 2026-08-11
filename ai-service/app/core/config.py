from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Safety Audit - Detection Service"

    yolo_weights_path: str = "weights/yolov11_ppe.pt"
    rtdetr_weights_path: str = "weights/rtdetr_behaviour.pt"

    frame_sample_fps: float = 2.0          # frames per second to analyze
    detection_confidence_threshold: float = 0.45
    tracking_iou_threshold: float = 0.3

    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "ai-safety-audit"

    backend_callback_url: str | None = None  # optional webhook back to Spring Boot

    class Config:
        env_prefix = "AI_SERVICE_"


settings = Settings()
