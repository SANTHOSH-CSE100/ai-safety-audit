from fastapi import FastAPI

from app.api.routes import router
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    description="Computer-vision detection service for the AI Safety Audit platform "
                "(PPE compliance, restricted-area entry, fire/smoke, unsafe behaviour, near-misses).",
    version="0.1.0",
)

app.include_router(router)


@app.get("/")
def root():
    return {"service": settings.app_name, "status": "running"}
