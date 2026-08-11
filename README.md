# AI Safety Audit — Industrial Monitoring System

An AI-powered platform for factory safety compliance: upload CCTV/handheld
footage, automatically detect PPE and safety violations, and get a
risk-scored report with a timeline, gallery, and analytics dashboard.

Full architecture: see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Repo Layout

| Path             | Project                                    | Stack |
|-------------------|---------------------------------------------|-------|
| `mobile-app/`     | Mobile dashboard (built separately)         | Expo SDK 57, React Native, NativeWind, Reanimated v4 |
| `backend/`        | REST API, auth, orchestration               | Java 21, Spring Boot 3.3, PostgreSQL, Redis |
| `ai-service/`     | Computer-vision detection service           | Python 3.11, FastAPI, YOLOv11, RT-DETR |
| `infrastructure/` | Docker, Kubernetes, NGINX, CI/CD            | Docker Compose, K8s, GitHub Actions |
| `docs/`           | Architecture & guides                        | Markdown |

## Quick Start (local dev)

```bash
# From repo root — spins up Postgres, Redis, MinIO, the AI service, the
# backend, and an NGINX reverse proxy.
docker compose up --build
```

- Backend Swagger UI: http://localhost:8080/swagger-ui.html
- AI service docs: http://localhost:8000/docs
- MinIO console: http://localhost:9001 (minioadmin / minioadmin)

## Running Components Individually

### Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Requires Postgres + Redis running (see `docker-compose.yml` for env vars, or
run just those two services: `docker compose up postgres redis minio`).

### AI Detection Service (FastAPI)
```bash
cd ai-service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Note: `weights/` needs `yolov11_ppe.pt` and `rtdetr_behaviour.pt` — trained
detection weights are not included in this repo (train/fine-tune on your
own PPE/behaviour dataset, or plug in a pretrained checkpoint for a
quick smoke test).

### Mobile App
Already scaffolded separately (Expo Router + NativeWind prototype using
mock JSON). Point its API client at `http://localhost:8080/api/v1` once the
backend is running, replacing the mock data layer.

## Current Status

- [x] System architecture & repo scaffolding
- [x] Mobile app UI/UX prototype (mock data)
- [x] Backend: DB schema (Flyway) + dev seed data, JWT auth (login/refresh),
      upload → AI-service → report persistence vertical slice
- [x] Backend: full CRUD for factories, users/roles, notifications, settings
- [x] Backend: analytics summary endpoint (30-day rollup + trend)
- [x] Backend: PDF report export (OpenPDF)
- [x] Backend: WebSocket (STOMP) live upload-status + notification push
- [x] AI service: frame extraction, YOLOv11 PPE detector, RT-DETR behaviour
      detector, violation classification, risk/safety scoring
- [x] Docker Compose for local dev, Dockerfiles, K8s manifests, CI
- [x] Full Expo SDK 57 mobile app (`mobile-app/`) built around the API
      layer — Expo Router navigation, protected routes, every screen
      (auth, dashboard, factories, upload with real progress, reports
      with PDF export/share, analytics with charts + date filter,
      notifications, profile), purple/white design system, React Query +
      Zustand, error boundary. See `mobile-app/WIRING_GUIDE.md`.
- [ ] Trained detection weights — needs a real annotated PPE/behaviour
      dataset and a training run; not something to fake with code
- [ ] Nightly job to populate `analytics_snapshots` (current analytics
      endpoint aggregates on the fly, fine at small scale)
- [ ] Push notifications (expo-notifications is installed but not wired
      to a backend push-token endpoint — live notifications currently
      rely on WebSocket while the app is foregrounded)
- [ ] Role-based UI hiding (backend enforces authorization either way;
      the app doesn't yet hide controls a VIEWER/SAFETY_OFFICER can't use)

## Dev Login (after seeding)

| Email | Password | Role |
|---|---|---|
| admin@ai-safety-audit.dev | password123 | ADMIN |
| officer@ai-safety-audit.dev | password123 | SAFETY_OFFICER |

Demo factory ID: `11111111-1111-1111-1111-111111111111`

See `docs/ARCHITECTURE.md` §8 for the recommended build order for what's
left.
