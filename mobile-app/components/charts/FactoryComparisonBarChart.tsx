import { ScrollView, View, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors } from "../../theme";

interface FactoryComparisonDatum {
  label: string;
  score: number;
}

const BAR_WIDTH = 26;
const SPACING = 22;
const INITIAL_SPACING = 12;
// Card padding (p-4 = 16 each side) + screen padding (px-5 = 20 each side).
const HORIZONTAL_CHROME = 16 * 2 + 20 * 2;

function truncateLabel(label: string, maxChars: number) {
  if (label.length <= maxChars) return label;
  return `${label.slice(0, Math.max(3, maxChars - 1)).trimEnd()}…`;
}

export function FactoryComparisonBarChart({ data }: { data: FactoryComparisonDatum[] }) {
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = screenWidth - HORIZONTAL_CHROME;

  const perBar = BAR_WIDTH + SPACING;
  const contentWidth = INITIAL_SPACING + data.length * perBar;
  const needsScroll = contentWidth > containerWidth;

  // Bars keep a fixed, comfortable width always (never shrunk to fit) — once
  // the chart needs to scroll, each bar has predictable room for its label;
  // when everything fits on screen, allow slightly longer labels.
  const maxLabelChars = needsScroll
    ? 10
    : Math.max(4, Math.floor(containerWidth / Math.max(data.length, 1) / 7));

  const bars = data.map((d) => ({
    value: d.score,
    label: truncateLabel(d.label, maxLabelChars),
    frontColor: colors.primary.DEFAULT,
  }));

  return (
    <ScrollView horizontal scrollEnabled={needsScroll} showsHorizontalScrollIndicator={needsScroll}>
      <View style={{ minWidth: needsScroll ? contentWidth : containerWidth }}>
        <BarChart
          data={bars}
          height={160}
          barWidth={BAR_WIDTH}
          barBorderRadius={6}
          spacing={SPACING}
          initialSpacing={INITIAL_SPACING}
          maxValue={100}
          noOfSections={4}
          yAxisTextStyle={{ color: colors.muted, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: colors.muted, fontSize: 9 }}
          rulesColor={colors.border}
          yAxisColor={colors.border}
          xAxisColor={colors.border}
        />
      </View>
    </ScrollView>
  );
}
