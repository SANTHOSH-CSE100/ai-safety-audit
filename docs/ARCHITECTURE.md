# AI Safety Audit — Industrial Monitoring System
## System Architecture

## 1. Overview

AI Safety Audit is a SaaS platform that lets factory safety officers upload
CCTV/handheld footage of a shop floor, automatically detect safety
violations (missing helmet/vest, restricted-area entry, fire/smoke, unsafe
behaviour, near-misses) using computer vision, and turn the results into a
timeline, a risk/safety score, and an exportable PDF report — all visible
in a mobile dashboard.

## 2. High-Level Architecture

```
┌─────────────────────────┐
│   React Native (Expo)   │  Mobile app — upload, dashboard, reports
│   TypeScript + NativeWind│
└────────────┬─────────────┘
             │ HTTPS (REST + WebSocket)
             ▼
┌─────────────────────────┐
│   Spring Boot Backend    │  Auth, business logic, orchestration
│   Java 21 / Spring 3.x   │
└──────┬───────────┬───────┘
       │           │
       ▼           ▼
 ┌───────────┐ ┌─────────┐
 │ PostgreSQL│ │  Redis  │   Persistence + cache/session/queue
 └───────────┘ └─────────┘
       │
       ▼
┌─────────────────────────┐
│  AI Detection Service    │  FastAPI + YOLOv11 + RT-DETR + OpenCV
│  Python 3.11             │
└─────────────────────────┘
       │
       ▼
   MinIO (S3-compatible object storage for video/frames/reports)
```

All four projects are independently deployable and communicate over REST
(and WebSocket for live processing status). The backend never talks
directly to GPU/model code — it calls the AI service over HTTP, so the
Python service can be scaled/replaced independently.

## 3. Request Flow — Video Upload to Report

1. Mobile app uploads video → Backend `/api/v1/uploads` → stored in MinIO,
   row created in `uploads` table, status `PENDING`.
2. Backend enqueues a processing job (Redis list / stream).
3. A worker (Spring `@Async` or separate consumer) calls the AI service
   `POST /detect/video` with a signed MinIO URL.
4. AI service: frame extraction (FFmpeg) → object detection (YOLOv11 for
   PPE/objects, RT-DETR for higher-precision restricted-zone/behaviour
   classes) → tracking → violation classification → structured JSON.
5. Backend persists `violations`, `timeline_events`, computes `risk_score`
   and `safety_score`, updates `uploads.status = COMPLETED`.
6. Backend pushes a WebSocket event to the mobile app; mobile app pulls the
   report, renders timeline/gallery/analytics, and can request a PDF export.

## 4. Tech Stack

### 4.1 Mobile (Project 1) — already scaffolded
- React Native + Expo SDK 57, Expo Router, TypeScript
- NativeWind (Tailwind for RN), Reanimated v4, Gesture Handler
- Expo Image / Blur / Linear Gradient, React Native SVG, Lucide Icons
- Zustand for state, Material Design 3 look, light theme

### 4.2 Backend (Project 2)
- Java 21, Spring Boot 3.3.x
- Spring Web, Spring Security + JWT (jjwt), Spring Data JPA (Hibernate)
- PostgreSQL 16, Flyway migrations, Redis (Lettuce) for cache/pub-sub
- MapStruct + Lombok, Bean Validation, springdoc-openapi (Swagger UI)
- WebSocket (STOMP) for live status, Maven build

### 4.3 AI Detection Service (Project 3)
- Python 3.11, FastAPI, Uvicorn
- Ultralytics YOLOv11 (PPE/object detection), RT-DETR (transformer
  detector for higher-precision classes)
- OpenCV + FFmpeg (frame extraction/video I/O), NumPy, PyTorch
- Pydantic schemas for structured JSON contracts

### 4.4 Infrastructure (Project 4)
- Docker + Docker Compose (local/dev), Kubernetes manifests (prod)
- NGINX reverse proxy / TLS termination
- MinIO (object storage), PostgreSQL, Redis as containers
- GitHub Actions CI/CD (build, test, lint, image push, deploy)

## 5. Database (summary — full DDL in Flyway migrations)

`users`, `roles`, `factories`, `uploads`, `reports`, `violations`,
`timeline_events`, `notifications`, `analytics_snapshots`, `settings`,
`audit_logs`. See `backend/src/main/resources/db/migration/V1__init.sql`.

## 6. AI Service JSON Contract

```json
{
  "video_id": "uuid",
  "duration_sec": 132.4,
  "frames_analyzed": 662,
  "violations": [
    {
      "type": "NO_HELMET",
      "confidence": 0.91,
      "timestamp_sec": 12.4,
      "bbox": [x, y, w, h],
      "track_id": 7,
      "severity": "HIGH"
    }
  ],
  "risk_score": 68,
  "safety_score": 32,
  "summary": { "NO_HELMET": 4, "RESTRICTED_AREA": 1 }
}
```

## 7. Repo Layout

```
ai-safety-audit/
├── mobile-app/        # Project 1 — React Native (Expo) — already built
├── backend/            # Project 2 — Spring Boot
├── ai-service/          # Project 3 — FastAPI + CV models
├── infrastructure/      # Project 4 — Docker/K8s/NGINX/CI
└── docs/                 # Architecture, API docs, guides
```

## 8. Build Order (recommended)

1. ✅ Mobile app UI/UX (done — Expo Router + NativeWind prototype)
2. Backend: entities → repositories → services → controllers → security → Swagger
3. AI service: frame extraction pipeline → detection modules → API
4. Wire backend → AI service (HTTP client + async job)
5. Infra: docker-compose for local dev, then CI/CD, then K8s manifests
6. Replace mobile mock JSON with real API calls
