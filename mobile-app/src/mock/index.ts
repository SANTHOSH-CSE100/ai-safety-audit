/**
 * Centralized demo/mock data layer.
 *
 * IMPORTANT: This module is the ONLY place mock data is defined. Screens and
 * hooks never hardcode fake values themselves — they call the fallback
 * helpers here, which only ever activate when the real API genuinely
 * returned nothing (see `DEMO_FALLBACK_ENABLED` in `./demoMode`). Real API
 * data always wins when it exists.
 */
export { DEMO_FALLBACK_ENABLED, isMockId, MOCK_ID_PREFIX } from "./demoMode";
export { mockFactories, MOCK_FACTORY_CHENNAI, MOCK_FACTORY_PUNE, MOCK_FACTORY_VIZAG } from "./factories";
export { getMockReports, getMockReport, mockReportsByFactoryId } from "./reports";
export { getMockUploads, mockUploadsByFactoryId } from "./uploads";
export { buildMockAnalytics } from "./analytics";
export { mockNotifications } from "./notifications";
