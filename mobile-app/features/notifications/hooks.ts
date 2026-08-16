import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUnreadCount,
  listNotifications,
  markNotificationRead,
} from "../../src/api/notifications";
import { queryKeys } from "../../constants/queryKeys";
import { DEMO_FALLBACK_ENABLED, isMockId, mockNotifications } from "../../src/mock";

/**
 * Notifications aren't factory-scoped, so unlike analytics/reports/uploads
 * this always calls the real endpoint — it only swaps the *result* for the
 * demo set when the real backend genuinely has nothing yet, OR when the call
 * fails outright (backend unreachable). `select` only runs on success, so
 * the error case is handled separately below rather than via `select`.
 */
export function useNotifications() {
  const query = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: listNotifications,
    select: (data) => (data.length === 0 && DEMO_FALLBACK_ENABLED ? mockNotifications : data),
  });

  const usingMockFallback = DEMO_FALLBACK_ENABLED && query.isError;
  return {
    ...query,
    data: usingMockFallback ? mockNotifications : query.data,
    isError: usingMockFallback ? false : query.isError,
  };
}

export function useUnreadCount() {
  const query = useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: getUnreadCount,
    refetchInterval: 30_000,
    select: (data) =>
      data.count === 0 && DEMO_FALLBACK_ENABLED
        ? { count: mockNotifications.filter((n) => !n.read).length }
        : data,
  });

  const usingMockFallback = DEMO_FALLBACK_ENABLED && query.isError;
  return {
    ...query,
    data: usingMockFallback ? { count: mockNotifications.filter((n) => !n.read).length } : query.data,
    isError: usingMockFallback ? false : query.isError,
  };
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      // Demo rows aren't real backend records — mark-as-read is simulated
      // client-side via the query cache instead of hitting the API.
      const mock = isMockId(id) ? mockNotifications.find((n) => n.id === id) : undefined;
      if (mock) return Promise.resolve({ ...mock, read: true });
      return markNotificationRead(id);
    },
    onSuccess: (_data, id) => {
      if (isMockId(id)) {
        // Update the demo set in place rather than invalidating — an
        // invalidation would just refetch the (still-empty) real endpoint
        // and undo the simulated read state.
        queryClient.setQueryData(queryKeys.notifications, () =>
          mockNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        return;
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
  });
}
