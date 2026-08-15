import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, MapPin, Clock, Upload } from "lucide-react-native";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { ScoreRing } from "../../../components/ui/ScoreRing";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { StatRow } from "../../../components/ui/StatRow";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { DemoBadge } from "../../../components/ui/DemoBadge";
import { ReportListItem } from "../../../features/reports/ReportListItem";
import { colors, typography } from "../../../theme";
import { useFactories } from "../../../features/factories/hooks";
import { useAnalytics } from "../../../features/analytics/hooks";
import { useReports } from "../../../features/reports/hooks";
import { useFactoryStore } from "../../../src/store/factoryStore";

export default function FactoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: factories } = useFactories();
  const factory = factories?.find((f) => f.id === id);
  const isMockMode = useFactoryStore((s) => s.isMockMode);

  const analyticsQuery = useAnalytics(id ?? null);
  const reportsQuery = useReports(id ?? null);
  const selectForUpload = useFactoryStore((s) => s.select);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
        <Pressable onPress={() => router.back()} hitSlop={12} className="w-10 h-10 items-center justify-center -ml-2">
          <ArrowLeft size={22} color={colors.ink} />
        </Pressable>
        {isMockMode ? <DemoBadge /> : null}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32, gap: 16 }} showsVerticalScrollIndicator={false}>
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

        <View className="px-5">
          <Button
            label="Upload video for this factory"
            icon={<Upload size={17} color="#fff" />}
            onPress={() => {
              if (factory) selectForUpload(factory);
              router.push("/(app)/upload");
            }}
            fullWidth
          />
        </View>

        {analyticsQuery.isLoading ? (
          <View className="px-5">
            <SkeletonCard />
          </View>
        ) : analyticsQuery.data ? (
          <View className="px-5">
            <Card className="flex-row items-center gap-4">
              <ScoreRing score={analyticsQuery.data.avgSafetyScoreLast30Days} size={80} label="Safety" />
              <View className="flex-1 gap-2">
                <StatRow label="Violations (30d)" value={analyticsQuery.data.totalViolationsLast30Days} />
                <StatRow label="Uploads (30d)" value={analyticsQuery.data.totalUploadsLast30Days} />
              </View>
            </Card>
          </View>
        ) : null}

        <View className="px-5 gap-3">
          <SectionHeader title="Recent Reports" />
          {reportsQuery.isLoading ? (
            <SkeletonCard />
          ) : reportsQuery.isError ? (
            <ErrorState message="Couldn't load reports." onRetry={() => reportsQuery.refetch()} />
          ) : reportsQuery.data && reportsQuery.data.length > 0 ? (
            <Card padded={false}>
              {reportsQuery.data.slice(0, 5).map((report, i) => (
                <ReportListItem key={report.id} report={report} isLast={i === Math.min(4, reportsQuery.data.length - 1)} />
              ))}
            </Card>
          ) : (
            <Text className={typography.secondaryText}>No reports yet for this factory.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
