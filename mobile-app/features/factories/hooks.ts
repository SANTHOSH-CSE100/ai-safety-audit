import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { listFactories } from "../../src/api/factories";
import { useFactoryStore } from "../../src/store/factoryStore";
import { queryKeys } from "../../constants/queryKeys";
import { DEMO_FALLBACK_ENABLED, mockFactories } from "../../src/mock";

/**
 * This is the single entry point for "is the real backend available".
 * Every other screen/hook in the app (reports, analytics, uploads,
 * notifications) takes its real-vs-demo cue from `useFactoryStore.isMockMode`,
 * which this hook is responsible for setting correctly.
 *
 * The fallback fires whenever the real call didn't produce usable data —
 * that's either a genuinely empty factory list (fresh backend, no seed data)
 * *or* the request failing outright (backend unreachable, wrong host,
 * timeout, 5xx). Only the empty-success case was handled before, so a
 * network failure fell through to the raw error state everywhere. See
 * src/mock/README-equivalent notes in src/mock/demoMode.ts.
 */
export function useFactories() {
  const setFactories = useFactoryStore((s) => s.setFactories);

  const query = useQuery({
    queryKey: queryKeys.factories,
    queryFn: listFactories,
    staleTime: 5 * 60_000,
  });

  const usingMockFallback =
    DEMO_FALLBACK_ENABLED && (query.isError || (query.isSuccess && query.data.length === 0));
  const effectiveData = usingMockFallback ? mockFactories : query.data;

  useEffect(() => {
    if (query.isLoading) return; // wait until the real call has settled one way or another
    if (usingMockFallback) {
      setFactories(mockFactories, true);
    } else if (query.data) {
      setFactories(query.data, false);
    }
  }, [query.isLoading, query.data, usingMockFallback, setFactories]);

  return {
    ...query,
    data: effectiveData,
    // Downstream screens read `isError`/`data` directly (not just the store),
    // so the fallback has to be reflected here too, not only in the store.
    isError: usingMockFallback ? false : query.isError,
    isSuccess: usingMockFallback ? true : query.isSuccess,
  };
}
