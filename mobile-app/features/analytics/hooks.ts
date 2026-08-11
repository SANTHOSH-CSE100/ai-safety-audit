import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "../../src/api/analytics";
import { queryKeys } from "../../constants/queryKeys";

export function useAnalytics(factoryId: string | null, days = 30) {
  return useQuery({
    queryKey: [...queryKeys.analytics(factoryId ?? ""), days],
    queryFn: () => getAnalyticsSummary(factoryId as string, days),
    enabled: !!factoryId,
  });
}
