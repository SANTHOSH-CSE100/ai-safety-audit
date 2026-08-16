import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { MapPin, Clock, ShieldAlert, Upload } from "lucide-react-native";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { SafetyScoreCard } from "../../../components/ui/SafetyScoreCard";
import { MetricCard } from "../../../components/ui/MetricCard";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { DemoBadge } from "../../../components/ui/DemoBadge";
import { DetailHeader } from "../../../components/layout/DetailHeader";
import { ReportListItem } from "../../../features/reports/ReportListItem";
import { colors, typography } from "../../../theme";
import { useFactories } from "../../../features/factories/hooks";
import { useAnalytics } from "../../../features/analytics/hooks";
import { useReports } from "../../../features/reports/hooks";
import { useFactoryStore } from "../../../src/store/factoryStore";

/**
 * Hierarchy is deliberate: identity → "how safe is this factory?" (safety
 * summary) → key metrics → recent reports → upload CTA last. The reader
 * should understand the factory's safety standing before being asked to
 * upload more footage.
 */
export default function FactoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: factories } = useFactories();
  const factory = factories?.find((f) => f.id === id);
  const isMockMode = useFactoryStore((s) => s.isMockMode);

  const analyticsQuery = useAnalytics(id ?? null);
  const reportsQuery = useReports(id ?? null);
  const selectForUpload = useFactoryStore((s) => s.select);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([analyticsQuery.refetch(), reportsQuery.refetch()]);
    setRefreshing(false);
  }, [analyticsQuery, reportsQuery]);

  const goUpload = () => {
    if (factory) selectForUpload(factory);
    router.push("/(app)/upload");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <DetailHeader title="Factory Details" right={isMockMode ? <DemoBadge /> : undefined} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32, gap: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Factory identity / location */}
        <View className="px-5 gap-1">
          <Text className={typography.screenTitle}>{factory?.name ?? "Factory"}</Text>
          {factory?.location ? (
            <View className="flex-row items-center gap-1">
              <MapPin size={13} color={colors.muted} />
              <Text className="text-sm text-muted">{factory.location}</Text>
            </View>
          ) : null}
          {factory?.timezone ? (
            <View className="flex-row items-center gap-1">
              <Clock size={13} color={colors.muted} />
              <Text className="text-sm text-muted">{factory.timezone}</Text>
            </View>
          ) : null}
        </View>

        {/* Safety summary + key metrics — answers "how safe is this factory?" first */}
        {analyticsQuery.isLoading ? (
          <View className="px-5">
            <SkeletonCard />
          </View>
        ) : analyticsQuery.isError ? (
          <View className="px-5">
            <ErrorState message="Couldn't load this factory's safety summary." onRetry={() => analyticsQuery.refetch()} />
          </View>
        ) : analyticsQuery.data ? (
          <View className="px-5 gap-3">
            <SafetyScoreCard
              score={analyticsQuery.data.avgSafetyScoreLast30Days}
              subtitle="30-day average for this factory"
            />
            <View className="flex-row gap-3">
              <MetricCard
                icon={ShieldAlert}
                label="Violations (30d)"
                value={analyticsQuery.data.totalViolationsLast30Days}
                tone={analyticsQuery.data.totalViolationsLast30Days > 0 ? "danger" : "success"}
              />
              <MetricCard
                icon={Upload}
                label="Uploads (30d)"
                value={analyticsQuery.data.totalUploadsLast30Days}
                tone="primary"
              />
            </View>
          </View>
        ) : null}

        {/* Recent reports */}
        <View className="px-5 gap-3">
          <SectionHeader title="Recent Reports" />
          {reportsQuery.isLoading ? (
            <SkeletonCard />
          ) : reportsQuery.isError ? (
            <ErrorState message="Couldn't load reports." onRetry={() => reportsQuery.refetch()} />
          ) : reportsQuery.data && reportsQuery.data.length > 0 ? (
            <Card padded={false} elevation="flat">
              {reportsQuery.data.slice(0, 5).map((report, i) => (
                <ReportListItem
                  key={report.id}
                  report={report}
                  isLast={i === Math.min(4, reportsQuery.data.length - 1)}
                />
              ))}
            </Card>
          ) : (
            <Text className={typography.secondaryText}>No reports yet for this factory.</Text>
          )}
        </View>

        {/* Primary CTA — comes after the reader has seen safety context, not before it */}
        <View className="px-5">
          <Button
            label="Upload video for this factory"
            icon={<Upload size={17} color="#fff" />}
            onPress={goUpload}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
