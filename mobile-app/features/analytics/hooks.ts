import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "../../src/api/analytics";
import { queryKeys } from "../../constants/queryKeys";
import { useFactoryStore } from "../../src/store/factoryStore";
import { buildMockAnalytics } from "../../src/mock";

export function useAnalytics(factoryId: string | null, days = 30) {
  // isMockMode is only ever true when the entire factories list came from
  // the demo fallback (see useFactories) — in that case every factoryId in
  // the app is a mock id, so every analytics call for it should be too.
  const isMockMode = useFactoryStore((s) => s.isMockMode);

  return useQuery({
    queryKey: [...queryKeys.analytics(factoryId ?? ""), days, isMockMode],
    queryFn: () =>
      isMockMode
        ? Promise.resolve(buildMockAnalytics(factoryId as string, days))
        : getAnalyticsSummary(factoryId as string, days),
    enabled: !!factoryId,
  });
}
