import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { colors } from "../../theme";
import { formatViolationType } from "../../utils/format";

const PALETTE = [
  colors.primary.DEFAULT,
  colors.danger,
  colors.warning,
  colors.info,
  colors.success,
  colors.primary[300],
  colors.critical,
];

export function ViolationPieChart({ breakdown }: { breakdown: Record<string, number> }) {
  const entries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (total === 0) {
    return (
      <View className="items-center py-6">
        <Text className="text-sm text-muted">No violations recorded in this period.</Text>
      </View>
    );
  }

  const data = entries.map(([type, count], i) => ({
    value: count,
    color: PALETTE[i % PALETTE.length],
    text: `${Math.round((count / total) * 100)}%`,
  }));

  return (
    <View className="flex-row items-center gap-5">
      <PieChart data={data} radius={70} innerRadius={42} innerCircleColor={colors.surface} />
      <View className="flex-1 gap-2">
        {entries.map(([type, count], i) => (
          <View key={type} className="flex-row items-center gap-2">
            <View
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
            />
            <Text className="text-xs text-ink flex-1" numberOfLines={1}>
              {formatViolationType(type)}
            </Text>
            <Text className="text-xs font-semibold text-muted">{count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
