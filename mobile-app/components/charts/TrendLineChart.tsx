import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { colors } from "../../theme";
import type { AnalyticsSummaryResponse } from "../../src/types/api";

export function TrendLineChart({ trend }: { trend: AnalyticsSummaryResponse["trend"] }) {
  const data = trend.map((point) => ({
    value: point.avgSafetyScore,
    label: point.date.slice(5), // MM-DD
    dataPointText: String(Math.round(point.avgSafetyScore)),
  }));

  if (data.length === 0) {
    return null;
  }

  return (
    <View className="items-start">
      <LineChart
        data={data}
        height={160}
        color={colors.primary.DEFAULT}
        thickness={3}
        startFillColor={colors.primary[100]}
        endFillColor={colors.surface}
        startOpacity={0.6}
        endOpacity={0.05}
        areaChart
        curved
        yAxisTextStyle={{ color: colors.muted, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: colors.muted, fontSize: 9 }}
        noOfSections={4}
        maxValue={100}
        rulesColor={colors.border}
        yAxisColor={colors.border}
        xAxisColor={colors.border}
        initialSpacing={16}
        spacing={44}
        hideDataPoints={data.length > 10}
        dataPointsColor={colors.primary.DEFAULT}
      />
    </View>
  );
}
