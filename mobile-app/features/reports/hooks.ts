import { useQuery } from "@tanstack/react-query";
import { getReport, listReports } from "../../src/api/reports";
import { queryKeys } from "../../constants/queryKeys";

export function useReports(factoryId: string | null) {
  return useQuery({
    queryKey: queryKeys.reports(factoryId ?? ""),
    queryFn: () => listReports(factoryId as string),
    enabled: !!factoryId,
  });
}

export function useReport(reportId: string | null) {
  return useQuery({
    queryKey: queryKeys.report(reportId ?? ""),
    queryFn: () => getReport(reportId as string),
    enabled: !!reportId,
  });
}
