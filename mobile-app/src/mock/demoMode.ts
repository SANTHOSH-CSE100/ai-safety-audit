/**
 * Central on/off switch for the demo-data fallback described in `src/mock/README.md`.
 *
 * Default: ON. When a real API response comes back empty (a fresh factory,
 * a backend with no seed data yet, a first-run demo device), screens fall
 * back to realistic mock data instead of looking broken/blank. The moment
 * the real backend has real rows, this fallback stops being used — it only
 * ever fills a genuine gap, never overrides real data.
 *
 * To disable for a specific build (e.g. a production/App-Store build where
 * an empty state should just be an empty state), set:
 *   EXPO_PUBLIC_DEMO_MODE=false
 * in that build's env file. Nothing else in the networking/auth layer reads
 * this flag — it only touches the mock-fallback checks in `features/*\/hooks.ts`.
 */
export const DEMO_FALLBACK_ENABLED = process.env.EXPO_PUBLIC_DEMO_MODE !== "false";

/** Every mock record uses this prefix so the UI can detect "this row is demo data" generically. */
export const MOCK_ID_PREFIX = "mock-";

export function isMockId(id: string | null | undefined): boolean {
  return !!id && id.startsWith(MOCK_ID_PREFIX);
}
