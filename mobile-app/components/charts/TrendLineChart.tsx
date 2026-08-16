import { View, ScrollView, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { colors } from "../../theme";
import type { AnalyticsSummaryResponse } from "../../src/types/api";

const INITIAL_SPACING = 16;
const COMFORTABLE_SPACING = 44; // spacing used when the chart needs to scroll
const MIN_READABLE_SPACING = 30; // below this, points/labels start colliding
const SAFETY_BUFFER = 24; // room for the last point's dot/label
// Card padding (p-4 = 16 each side) + screen padding (px-5 = 20 each side).
const HORIZONTAL_CHROME = 16 * 2 + 20 * 2;

export function TrendLineChart({ trend }: { trend: AnalyticsSummaryResponse["trend"] }) {
  const { width: screenWidth } = useWindowDimensions();

  const data = trend.map((point) => ({
    value: point.avgSafetyScore,
    label: point.date.slice(5), // MM-DD
    dataPointText: String(Math.round(point.avgSafetyScore)),
  }));

  if (data.length === 0) {
    return null;
  }

  const containerWidth = screenWidth - HORIZONTAL_CHROME;
  // At short date ranges, spread points to fill the available width evenly.
  // At longer ranges, keep spacing comfortable and let the chart scroll
  // horizontally instead of squeezing points/labels until they're unreadable.
  const fitSpacing =
    data.length > 1 ? (containerWidth - INITIAL_SPACING - SAFETY_BUFFER) / (data.length - 1) : containerWidth;
  const needsScroll = fitSpacing < MIN_READABLE_SPACING;
  const spacing = needsScroll ? COMFORTABLE_SPACING : fitSpacing;

  return (
    <View className="items-start">
      <ScrollView
        horizontal
        scrollEnabled={needsScroll}
        showsHorizontalScrollIndicator={needsScroll}
      >
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
          initialSpacing={INITIAL_SPACING}
          spacing={spacing}
          hideDataPoints={data.length > 10}
          dataPointsColor={colors.primary.DEFAULT}
        />
      </ScrollView>
    </View>
  );
}
