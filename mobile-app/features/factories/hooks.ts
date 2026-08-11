import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { listFactories } from "../../src/api/factories";
import { useFactoryStore } from "../../src/store/factoryStore";
import { queryKeys } from "../../constants/queryKeys";

export function useFactories() {
  const setFactories = useFactoryStore((s) => s.setFactories);

  const query = useQuery({
    queryKey: queryKeys.factories,
    queryFn: listFactories,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (query.data) setFactories(query.data);
  }, [query.data, setFactories]);

  return query;
}
