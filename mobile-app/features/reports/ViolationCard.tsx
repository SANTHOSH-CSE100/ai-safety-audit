import { Text, View } from "react-native";
import { AlertCircle, Target } from "lucide-react-native";
import { Card } from "../../components/ui/Card";
import { SeverityBadge } from "../../components/ui/SeverityBadge";
import { colors } from "../../theme";
import { formatSeconds, formatPercent, formatViolationType } from "../../utils/format";
import { severityColor } from "../../utils/severity";
import type { ReportDetailResponse } from "../../src/types/api";

export function ViolationCard({ violation }: { violation: ReportDetailResponse["violations"][number] }) {
  return (
    <Card className="gap-2">
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-2 flex-1">
          <AlertCircle size={16} color={severityColor(violation.severity)} />
          <Text className="text-sm font-semibold text-ink flex-1">
            {formatViolationType(violation.type)}
          </Text>
        </View>
        <SeverityBadge severity={violation.severity} />
      </View>

      <View className="flex-row items-center gap-4 mt-1">
        <View className="flex-row items-center gap-1.5">
          <Target size={13} color={colors.muted} />
          <Text className="text-xs text-muted">{formatPercent(violation.confidence * 100)} confidence</Text>
        </View>
        <Text className="text-xs text-muted">at {formatSeconds(violation.timestampSec)}</Text>
      </View>
    </Card>
  );
}
