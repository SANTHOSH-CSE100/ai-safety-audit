import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { BarChart3, ShieldAlert, Upload as UploadIcon } from "lucide-react-native";
import { AppHeader } from "../../../components/layout/AppHeader";
import { FactorySelector } from "../../../components/layout/FactorySelector";
import { Card } from "../../../components/ui/Card";
import { ScoreRing } from "../../../components/ui/ScoreRing";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { EmptyState } from "../../../components/ui/EmptyState";
import { TrendLineChart } from "../../../components/charts/TrendLineChart";
import { ViolationPieChart } from "../../../components/charts/ViolationPieChart";
import { FactoryComparisonBarChart } from "../../../components/charts/FactoryComparisonBarChart";
import { DateRangeFilter } from "../../../features/analytics/DateRangeFilter";
import { colors } from "../../../theme";
import { useAnalytics } from "../../../features/analytics/hooks";
import { useFactories } from "../../../features/factories/hooks";
import { useFactoryStore } from "../../../src/store/factoryStore";
import { getAnalyticsSummary } from "../../../src/api/analytics";
import { queryKeys } from "../../../constants/queryKeys";

export default function AnalyticsScreen() {
  useFactories();
  const { factories, selected } = useFactoryStore();
  const [days, setDays] = useState(30);
  const analyticsQuery = useAnalytics(selected?.id ?? null, days);

  // Factory comparison — only meaningful with more than one factory.
  const comparisonQueries = useQueries({
    queries: factories.map((f) => ({
      queryKey: [...queryKeys.analytics(f.id), days],
      queryFn: () => getAnalyticsSummary(f.id, days),
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
        <View className="px-5 gap-3"><SkeletonCard /><SkeletonCard /></View>
      ) : analyticsQuery.isError ? (
        <ErrorState message="Couldn't load analytics." onRetry={() => analyticsQuery.refetch()} />
      ) : analyticsQuery.data ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 40, gap: 20 }} showsVerticalScrollIndicator={false}>
          <View className="px-5 flex-row gap-3">
            <Card className="flex-1 items-center gap-2">
              <ScoreRing score={analyticsQuery.data.avgSafetyScoreLast30Days} size={76} />
              <Text className="text-xs text-muted">Avg Safety</Text>
            </Card>
            <Card className="flex-1 items-center justify-center gap-2">
              <ShieldAlert size={22} color={colors.danger} />
              <Text className="text-xl font-bold text-ink">{analyticsQuery.data.totalViolationsLast30Days}</Text>
              <Text className="text-xs text-muted">Violations</Text>
            </Card>
            <Card className="flex-1 items-center justify-center gap-2">
              <UploadIcon size={22} color={colors.primary.DEFAULT} />
              <Text className="text-xl font-bold text-ink">{analyticsQuery.data.totalUploadsLast30Days}</Text>
              <Text className="text-xs text-muted">Uploads</Text>
            </Card>
          </View>

          <View className="px-5 gap-3">
            <Text className="text-base font-bold text-ink">Safety Score Trend</Text>
            <Card>
              {analyticsQuery.data.trend.length > 0 ? (
                <TrendLineChart trend={analyticsQuery.data.trend} />
              ) : (
                <Text className="text-sm text-muted py-6 text-center">Not enough data yet.</Text>
              )}
            </Card>
          </View>

          <View className="px-5 gap-3">
            <Text className="text-base font-bold text-ink">Risk Breakdown</Text>
            <Card>
              <ViolationPieChart breakdown={analyticsQuery.data.violationBreakdown} />
            </Card>
          </View>

          {factories.length > 1 ? (
            <View className="px-5 gap-3">
              <Text className="text-base font-bold text-ink">Factory Comparison</Text>
              <Card>
                <FactoryComparisonBarChart data={comparisonData} />
              </Card>
            </View>
          ) : null}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
