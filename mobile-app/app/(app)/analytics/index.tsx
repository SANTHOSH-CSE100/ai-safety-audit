import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { BarChart3, ShieldAlert, Upload as UploadIcon } from "lucide-react-native";
import { AppHeader } from "../../../components/layout/AppHeader";
import { FactorySelector } from "../../../components/layout/FactorySelector";
import { MetricCard } from "../../../components/ui/MetricCard";
import { ChartCard } from "../../../components/ui/ChartCard";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { EmptyState } from "../../../components/ui/EmptyState";
import { TrendLineChart } from "../../../components/charts/TrendLineChart";
import { ViolationPieChart } from "../../../components/charts/ViolationPieChart";
import { FactoryComparisonBarChart } from "../../../components/charts/FactoryComparisonBarChart";
import { DateRangeFilter } from "../../../features/analytics/DateRangeFilter";
import { useAnalytics } from "../../../features/analytics/hooks";
import { useFactories } from "../../../features/factories/hooks";
import { useFactoryStore } from "../../../src/store/factoryStore";
import { getAnalyticsSummary } from "../../../src/api/analytics";
import { buildMockAnalytics } from "../../../src/mock";
import { queryKeys } from "../../../constants/queryKeys";

export default function AnalyticsScreen() {
  useFactories();
  const { factories, selected, isMockMode } = useFactoryStore();
  const [days, setDays] = useState(30);
  const analyticsQuery = useAnalytics(selected?.id ?? null, days);

  // Factory comparison — only meaningful with more than one factory.
  const comparisonQueries = useQueries({
    queries: factories.map((f) => ({
      queryKey: [...queryKeys.analytics(f.id), days, isMockMode],
      queryFn: () =>
        isMockMode ? Promise.resolve(buildMockAnalytics(f.id, days)) : getAnalyticsSummary(f.id, days),
      staleTime: 60_000,
    })),
  });

  const comparisonData = factories.map((f, i) => ({
    label: f.name,
    score: comparisonQueries[i]?.data?.avgSafetyScoreLast30Days ?? 0,
  }));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader title="Analytics" subtitle={`Last ${days} days`} />
      <FactorySelector />
      <View className="mb-3">
        <DateRangeFilter days={days} onChange={setDays} />
      </View>

      {!selected ? (
        <EmptyState icon={BarChart3} title="Select a factory" description="Choose a factory to view analytics." />
      ) : analyticsQuery.isLoading ? (
        <View className="px-5 gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : analyticsQuery.isError ? (
        <ErrorState message="Couldn't load analytics." onRetry={() => analyticsQuery.refetch()} />
      ) : analyticsQuery.data ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 40, gap: 20 }} showsVerticalScrollIndicator={false}>
          <View className="px-5 flex-row gap-3">
            <MetricCard
              icon={ShieldAlert}
              label="Violations"
              value={analyticsQuery.data.totalViolationsLast30Days}
              tone={analyticsQuery.data.totalViolationsLast30Days > 0 ? "danger" : "success"}
            />
            <MetricCard icon={UploadIcon} label="Uploads" value={analyticsQuery.data.totalUploadsLast30Days} tone="primary" />
            <MetricCard
              icon={BarChart3}
              label="Avg Safety"
              value={analyticsQuery.data.avgSafetyScoreLast30Days}
              tone={analyticsQuery.data.avgSafetyScoreLast30Days >= 75 ? "success" : "warning"}
            />
          </View>

          <View className="px-5">
            <ChartCard title="Safety Score Trend" subtitle={`${days}-day rolling average`} isDemo={isMockMode}>
              {analyticsQuery.data.trend.length > 0 ? (
                <TrendLineChart trend={analyticsQuery.data.trend} />
              ) : (
                <Text className="text-sm text-muted py-6 text-center">Not enough data yet.</Text>
              )}
            </ChartCard>
          </View>

          <View className="px-5">
            <ChartCard title="Risk Breakdown" subtitle="By violation type" isDemo={isMockMode}>
              <ViolationPieChart breakdown={analyticsQuery.data.violationBreakdown} />
            </ChartCard>
          </View>

          {factories.length > 1 ? (
            <View className="px-5">
              <ChartCard title="Factory Comparison" subtitle="Average safety score" isDemo={isMockMode}>
                <FactoryComparisonBarChart data={comparisonData} />
              </ChartCard>
            </View>
          ) : null}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
