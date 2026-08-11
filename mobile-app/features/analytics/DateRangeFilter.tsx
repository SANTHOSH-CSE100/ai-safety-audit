import { Pressable, Text, View } from "react-native";
import { colors } from "../../theme";

const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
] as const;

export function DateRangeFilter({
  days,
  onChange,
}: {
  days: number;
  onChange: (days: number) => void;
}) {
  return (
    <View className="flex-row bg-surface border border-border rounded-pill p-1 self-start mx-5">
      {RANGES.map((range) => {
        const active = range.days === days;
        return (
          <Pressable
            key={range.days}
            onPress={() => onChange(range.days)}
            className="px-4 py-1.5 rounded-pill"
            style={{ backgroundColor: active ? colors.primary.DEFAULT : "transparent" }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: active ? "#fff" : colors.muted }}
            >
              {range.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
