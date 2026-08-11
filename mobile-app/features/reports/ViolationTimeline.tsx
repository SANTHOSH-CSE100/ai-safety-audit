import { Text, View } from "react-native";
import { colors } from "../../theme";
import { severityColor } from "../../utils/severity";
import { formatSeconds, formatViolationType } from "../../utils/format";
import type { ReportDetailResponse } from "../../src/types/api";

export function ViolationTimeline({ violations }: { violations: ReportDetailResponse["violations"] }) {
  const sorted = [...violations].sort((a, b) => a.timestampSec - b.timestampSec);

  return (
    <View className="gap-0">
      {sorted.map((v, i) => (
        <View key={v.id} className="flex-row gap-3">
          <View className="items-center w-6">
            <View
              className="w-3 h-3 rounded-full mt-1"
              style={{ backgroundColor: severityColor(v.severity) }}
            />
            {i < sorted.length - 1 ? <View className="w-0.5 flex-1 bg-border" /> : null}
          </View>
          <View className="flex-1 pb-5">
            <Text className="text-xs font-semibold text-muted">{formatSeconds(v.timestampSec)}</Text>
            <Text className="text-sm font-medium text-ink mt-0.5">{formatViolationType(v.type)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
