import { Text, View } from "react-native";
import { typography } from "../../theme";
import { cn } from "../../utils/cn";

/** A label/value pair, e.g. inside a card summarizing a few facts (violations, uploads, timezone...). */
export function StatRow({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <View className={cn("flex-row items-center justify-between", className)}>
      <Text className={typography.secondaryText}>{label}</Text>
      <Text className="text-base font-bold text-ink">{value}</Text>
    </View>
  );
}
