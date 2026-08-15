import { useQuery } from "@tanstack/react-query";
import { getReport, listReports } from "../../src/api/reports";
import { queryKeys } from "../../constants/queryKeys";
import { useFactoryStore } from "../../src/store/factoryStore";
import { getMockReport, getMockReports, isMockId } from "../../src/mock";

export function useReports(factoryId: string | null) {
  const isMockMode = useFactoryStore((s) => s.isMockMode);

  return useQuery({
    queryKey: [...queryKeys.reports(factoryId ?? ""), isMockMode],
    queryFn: () =>
      isMockMode ? Promise.resolve(getMockReports(factoryId as string)) : listReports(factoryId as string),
    enabled: !!factoryId,
  });
}

export function useReport(reportId: string | null) {
  const isMock = isMockId(reportId);

  return useQuery({
    queryKey: queryKeys.report(reportId ?? ""),
    queryFn: () => {
      if (!isMock) return getReport(reportId as string);
      const mock = getMockReport(reportId as string);
      if (!mock) throw new Error("Demo report not found");
      return Promise.resolve(mock);
    },
    enabled: !!reportId,
  });
}
