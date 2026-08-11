import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { colors } from "../../theme";

interface FactoryComparisonDatum {
  label: string;
  score: number;
}

export function FactoryComparisonBarChart({ data }: { data: FactoryComparisonDatum[] }) {
  const bars = data.map((d) => ({
    value: d.score,
    label: d.label.length > 8 ? d.label.slice(0, 8) + "…" : d.label,
    frontColor: colors.primary.DEFAULT,
  }));

  return (
    <BarChart
      data={bars}
      height={160}
      barWidth={26}
      barBorderRadius={6}
      spacing={22}
      maxValue={100}
      noOfSections={4}
      yAxisTextStyle={{ color: colors.muted, fontSize: 10 }}
      xAxisLabelTextStyle={{ color: colors.muted, fontSize: 9 }}
      rulesColor={colors.border}
      yAxisColor={colors.border}
      xAxisColor={colors.border}
    />
  );
}
