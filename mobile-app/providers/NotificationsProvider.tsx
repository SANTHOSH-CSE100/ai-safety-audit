import { PropsWithChildren, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../src/api/users";
import { useLiveNotifications } from "../src/hooks/useLiveNotifications";
import { useAuthStore } from "../src/store/authStore";
import { queryKeys } from "../constants/queryKeys";

export function NotificationsProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);

  const { data: me } = useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    enabled: !!accessToken,
    staleTime: 5 * 60_000,
  });

  const latest = useLiveNotifications(me?.id ?? null);

  useEffect(() => {
    if (!latest) return;

    Toast.show({
      type: "info",
      text1: latest.title,
      text2: latest.body ?? undefined,
    });

    queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
  }, [latest, queryClient]);

  return <>{children}</>;
}
