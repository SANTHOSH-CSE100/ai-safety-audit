# Mobile App — AI Safety Audit

A complete Expo SDK 57 app built around the API integration layer in
`src/`. Purple/white design system, React Query + Zustand for state,
Expo Router for navigation, all screens wired to the real backend — no
mock data.

## Setup

```bash
npm install
npx expo install   # sanity-checks native module versions against your SDK
```

Set your API URL (a physical device needs your machine's LAN IP, not
`localhost`):
```
EXPO_PUBLIC_API_BASE_URL=http://<your-machine-LAN-IP>:8080/api/v1
```

```bash
npx expo start
```

Demo login: `admin@ai-safety-audit.dev` / `password123` (seeded by the
backend's `V2__dev_seed_data.sql` migration).

## Structure

```
app/                  Expo Router screens (file-based routing)
  (auth)/              login, forgot-password — guest-only, redirects to
                       dashboard if already signed in
  (app)/               dashboard, factories, upload, reports, analytics,
                       notifications, profile — protected, redirects to
                       login if signed out
components/
  ui/                  Button, Card, Input, Badge, ScoreRing, Skeleton,
                       EmptyState, ErrorState, etc. — the design system
  charts/              gifted-charts wrappers (trend, pie, bar)
  layout/              AppHeader, FactorySelector
features/              Screen-specific hooks and sub-components, grouped
                       by domain (dashboard, factories, uploads, reports,
                       analytics, notifications, auth)
providers/             QueryProvider, AuthGate/GuestGate, NotificationsProvider
                       (WebSocket to toast bridge), ErrorBoundary
src/                   The pre-existing API integration layer (api/,
                       hooks/, store/, types/) — untouched except two
                       small additive files: src/api/users.ts (GET
                       /users/me, needed to resolve the current user's id
                       for notification subscriptions) and a
                       forgotPassword() export appended to src/api/auth.ts
theme/, constants/, utils/   Design tokens, React Query keys, formatters
```

## What's real vs. what's a placeholder

- Every screen reads from the live backend via React Query — no mock
  JSON anywhere.
- Video upload progress is real (expo-file-system's createUploadTask,
  not a fake progress bar).
- PDF download/share is real (expo-file-system + expo-sharing, with the
  JWT sent as a proper Authorization header — not a query param, which
  the backend doesn't read).
- assets/images/*.png are placeholder icons generated for this scaffold
  (solid purple shield mark) — swap them for real brand assets before
  shipping.
- Analytics date range (7D/30D/90D) is wired to a real days query param
  added to the backend's /analytics/summary endpoint.
- Offline support is React Query's default cache-while-revalidate
  behavior, not a dedicated offline queue/sync layer — fine for viewing
  stale data offline, not for queuing uploads made while offline.

## Known gaps

- No silent background token refresh — refresh happens reactively on the
  next 401, which is fine for a mobile session but means a fully offline
  app-open after the access token expires will show one failed request
  before recovering.
- expo-notifications is a dependency (per the original spec) but push
  notifications aren't registered/wired — the app currently relies on
  the WebSocket connection for live in-app notifications, which only
  works while the app is foregrounded. Wiring expo-notifications for
  background push would need a push token registration endpoint on the
  backend, which doesn't exist yet.
- Role-based UI (hiding admin-only actions for VIEWER/SAFETY_OFFICER)
  isn't implemented — the backend enforces authorization either way, but
  the app doesn't yet hide controls the user can't use.
