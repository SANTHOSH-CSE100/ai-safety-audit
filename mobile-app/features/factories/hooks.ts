import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { listFactories } from "../../src/api/factories";
import { useFactoryStore } from "../../src/store/factoryStore";
import { queryKeys } from "../../constants/queryKeys";
import { DEMO_FALLBACK_ENABLED, mockFactories } from "../../src/mock";

export function useFactories() {
  const setFactories = useFactoryStore((s) => s.setFactories);

  const query = useQuery({
    queryKey: queryKeys.factories,
    queryFn: listFactories,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (!query.data) return;
    // The real backend has nothing yet — fall back to realistic demo data
    // instead of leaving every downstream screen empty. See src/mock/.
    if (query.data.length === 0 && DEMO_FALLBACK_ENABLED) {
      setFactories(mockFactories, true);
    } else {
      setFactories(query.data, false);
    }
  }, [query.data, setFactories]);

  return query;
}
