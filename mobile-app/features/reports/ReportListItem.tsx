import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { ChevronRight, ShieldAlert } from "lucide-react-native";
import { colors } from "../../theme";
import { scoreColor } from "../../utils/severity";
import { formatDate } from "../../utils/format";
import type { ReportDetailResponse } from "../../src/types/api";

export function ReportListItem({
  report,
  isLast,
}: {
  report: ReportDetailResponse;
  isLast?: boolean;
}) {
  const color = scoreColor(report.safetyScore);

  return (
    <Pressable
      onPress={() => router.push(`/(app)/reports/${report.id}` as never)}
      className={`flex-row items-center gap-3 p-4 ${isLast ? "" : "border-b border-border"}`}
    >
      <View
        className="w-11 h-11 rounded-full items-center justify-center"
        style={{ backgroundColor: `${color}1A` }}
      >
        <Text style={{ color, fontWeight: "800", fontSize: 13 }}>{report.safetyScore}</Text>
      </View>

      <View className="flex-1">
        {report.title ? (
          <Text className="text-sm font-medium text-ink" numberOfLines={1}>
            {report.title}
          </Text>
        ) : null}
        <View className="flex-row items-center gap-1.5">
          <ShieldAlert size={13} color={colors.muted} />
          <Text className={report.title ? "text-xs text-muted" : "text-sm font-medium text-ink"}>
            {report.violations.length} violation{report.violations.length === 1 ? "" : "s"}
          </Text>
        </View>
        <Text className="text-xs text-muted mt-0.5">{formatDate(report.createdAt)}</Text>
      </View>

      <ChevronRight size={16} color={colors.muted} />
    </Pressable>
  );
}
