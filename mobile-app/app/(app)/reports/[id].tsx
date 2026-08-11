import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Download, Share2 } from "lucide-react-native";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { ScoreRing } from "../../../components/ui/ScoreRing";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { ViolationCard } from "../../../features/reports/ViolationCard";
import { ViolationTimeline } from "../../../features/reports/ViolationTimeline";
import { ViolationPieChart } from "../../../components/charts/ViolationPieChart";
import { usePdfDownload } from "../../../features/reports/usePdfDownload";
import { colors } from "../../../theme";
import { formatDate } from "../../../utils/format";
import { useReport } from "../../../features/reports/hooks";

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: report, isLoading, isError, refetch } = useReport(id ?? null);
  const { downloadAndShare, downloading } = usePdfDownload(id ?? "");

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
        <Pressable onPress={() => router.back()} hitSlop={12} className="w-10 h-10 items-center justify-center -ml-2">
          <ArrowLeft size={22} color={colors.ink} />
        </Pressable>
        <Text className="text-base font-bold text-ink">Safety Report</Text>
        <View className="w-10" />
      </View>

      {isLoading ? (
        <View className="px-5"><SkeletonCard /></View>
      ) : isError || !report ? (
        <ErrorState message="Couldn't load this report." onRetry={() => refetch()} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40, gap: 20 }} showsVerticalScrollIndicator={false}>
          <View className="px-5 items-center gap-2">
            <ScoreRing score={report.safetyScore} size={130} strokeWidth={12} label="Safety Score" />
            <Text className="text-xs text-muted">{formatDate(report.createdAt)}</Text>
          </View>

          <View className="px-5 flex-row gap-3">
            <Button
              label="Download PDF"
              variant="secondary"
              icon={<Download size={16} color={colors.primary.DEFAULT} />}
              onPress={downloadAndShare}
              loading={downloading}
              className="flex-1"
            />
            <Button
              label="Share"
              variant="ghost"
              icon={<Share2 size={16} color={colors.ink} />}
              onPress={downloadAndShare}
              className="flex-1"
            />
          </View>

          {Object.keys(report.summary).length > 0 ? (
            <View className="px-5 gap-3">
              <Text className="text-base font-bold text-ink">Violation Breakdown</Text>
              <Card>
                <ViolationPieChart breakdown={report.summary} />
              </Card>
            </View>
          ) : null}

          <View className="px-5 gap-3">
            <Text className="text-base font-bold text-ink">Timeline</Text>
            <Card>
              <ViolationTimeline violations={report.violations} />
            </Card>
          </View>

          <View className="px-5 gap-3">
            <Text className="text-base font-bold text-ink">
              All Violations ({report.violations.length})
            </Text>
            <View className="gap-2.5">
              {report.violations.map((v) => (
                <ViolationCard key={v.id} violation={v} />
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
