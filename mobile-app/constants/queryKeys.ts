/** Centralized React Query keys — keeps invalidation consistent across the app. */
export const queryKeys = {
  factories: ["factories"] as const,
  uploads: (factoryId: string) => ["uploads", factoryId] as const,
  upload: (id: string) => ["upload", id] as const,
  reports: (factoryId: string) => ["reports", factoryId] as const,
  report: (id: string) => ["report", id] as const,
  analytics: (factoryId: string) => ["analytics", factoryId] as const,
  notifications: ["notifications"] as const,
  unreadCount: ["notifications", "unread-count"] as const,
  me: ["me"] as const,
};
