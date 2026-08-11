import os
import tempfile

from loguru import logger
from minio import Minio

from app.core.config import settings


class ObjectStorageClient:
    def __init__(self):
        self.client = Minio(
            settings.minio_endpoint,
            access_key=settings.minio_access_key,
            secret_key=settings.minio_secret_key,
            secure=settings.minio_endpoint.startswith("https"),
        )
        self.bucket = settings.minio_bucket

    def download_to_temp(self, object_key: str) -> str:
        suffix = os.path.splitext(object_key)[1] or ".mp4"
        fd, local_path = tempfile.mkstemp(suffix=suffix)
        os.close(fd)

        logger.info(f"Downloading {object_key} from bucket {self.bucket} -> {local_path}")
        self.client.fget_object(self.bucket, object_key, local_path)
        return local_path
