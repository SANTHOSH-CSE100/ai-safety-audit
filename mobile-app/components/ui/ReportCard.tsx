import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { ChevronRight, ShieldAlert } from "lucide-react-native";
import { Card } from "./Card";
import { SeverityBadge } from "./SeverityBadge";
import { colors, typography } from "../../theme";
import { scoreColor } from "../../utils/severity";
import { formatDate } from "../../utils/format";
import type { ReportDetailResponse, Severity } from "../../src/types/api";

const SEVERITY_RANK: Record<Severity, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };

/** Standalone elevated card for a report — used where a report should read as its own item, not a dense list row (see ReportListItem for that). */
export function ReportCard({ report }: { report: ReportDetailResponse }) {
  const color = scoreColor(report.safetyScore);
  const topSeverity = [...report.violations].sort(
    (a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]
  )[0];

  return (
    <Pressable onPress={() => router.push(`/(app)/reports/${report.id}` as never)}>
      <Card className="flex-row items-center gap-3.5">
        <View className="w-14 h-14 rounded-2xl items-center justify-center" style={{ backgroundColor: `${color}1A` }}>
          <Text style={{ color, fontWeight: "800", fontSize: 18 }}>{report.safetyScore}</Text>
        </View>
        <View className="flex-1 gap-1.5">
          <View className="flex-row items-center gap-1.5">
            <ShieldAlert size={13} color={colors.muted} />
            <Text className={typography.cardTitle}>
              {report.violations.length} violation{report.violations.length === 1 ? "" : "s"}
            </Text>
          </View>
          <Text className={typography.caption}>{formatDate(report.createdAt)}</Text>
          {topSeverity ? <SeverityBadge severity={topSeverity.severity} /> : null}
        </View>
        <ChevronRight size={18} color={colors.muted} />
      </Card>
    </Pressable>
  );
}
