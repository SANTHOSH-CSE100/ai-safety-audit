import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Download, Share2 } from "lucide-react-native";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { ScoreRing } from "../../../components/ui/ScoreRing";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { ChartCard } from "../../../components/ui/ChartCard";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { DemoBadge } from "../../../components/ui/DemoBadge";
import { ViolationCard } from "../../../features/reports/ViolationCard";
import { ViolationTimeline } from "../../../features/reports/ViolationTimeline";
import { ViolationPieChart } from "../../../components/charts/ViolationPieChart";
import { usePdfDownload } from "../../../features/reports/usePdfDownload";
import { colors, typography } from "../../../theme";
import { formatDate } from "../../../utils/format";
import { severityColor } from "../../../utils/severity";
import { isMockId } from "../../../src/mock";
import { useReport } from "../../../features/reports/hooks";
import type { Severity } from "../../../src/types/api";

const SEVERITY_ORDER: Severity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: report, isLoading, isError, refetch } = useReport(id ?? null);
  const { downloadAndShare, downloading } = usePdfDownload(id ?? "");
  const isDemo = isMockId(id);

  const severityCounts = report
    ? SEVERITY_ORDER.map((severity) => ({
        severity,
        count: report.violations.filter((v) => v.severity === severity).length,
      })).filter((s) => s.count > 0)
    : [];

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
        <View className="px-5">
          <SkeletonCard />
        </View>
      ) : isError || !report ? (
        <ErrorState message="Couldn't load this report." onRetry={() => refetch()} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40, gap: 20 }} showsVerticalScrollIndicator={false}>
          <View className="px-5 items-center gap-2">
            {isDemo ? <DemoBadge /> : null}
            <ScoreRing score={report.safetyScore} size={130} strokeWidth={12} label="Safety Score" />
            <Text className={typography.caption}>{formatDate(report.createdAt)}</Text>
          </View>

          {severityCounts.length > 0 ? (
            <View className="px-5 flex-row gap-2.5">
              {severityCounts.map(({ severity, count }) => (
                <Card key={severity} className="flex-1 items-center gap-1 py-3">
                  <Text className="text-xl font-extrabold" style={{ color: severityColor(severity) }}>
                    {count}
                  </Text>
                  <Text className={typography.caption}>{severity}</Text>
                </Card>
              ))}
            </View>
          ) : null}

          <View className="px-5 flex-row gap-3">
            <Button
              label="Download PDF"
              variant="secondary"
              icon={<Download size={16} color={colors.primary.DEFAULT} />}
              onPress={downloadAndShare}
              loading={downloading}
              disabled={isDemo}
              className="flex-1"
            />
            <Button
              label="Share"
              variant="ghost"
              icon={<Share2 size={16} color={colors.ink} />}
              onPress={downloadAndShare}
              disabled={isDemo}
              className="flex-1"
            />
          </View>
          {isDemo ? (
            <Text className={typography.caption + " px-5 -mt-3"}>
              Export is disabled for demo reports — connect a real factory to download a PDF.
            </Text>
          ) : null}

          {Object.keys(report.summary).length > 0 ? (
            <View className="px-5">
              <ChartCard title="Violation Breakdown" subtitle="Share of total findings">
                <ViolationPieChart breakdown={report.summary} />
              </ChartCard>
            </View>
          ) : null}

          <View className="px-5 gap-3">
            <SectionHeader title="Timeline" />
            <Card>
              <ViolationTimeline violations={report.violations} />
            </Card>
          </View>

          <View className="px-5 gap-3">
            <SectionHeader title={`All Violations (${report.violations.length})`} />
            {report.violations.length === 0 ? (
              <Card className="items-center py-6">
                <Text className={typography.secondaryText}>No violations were found in this footage.</Text>
              </Card>
            ) : (
              <View className="gap-2.5">
                {report.violations.map((v) => (
                  <ViolationCard key={v.id} violation={v} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
