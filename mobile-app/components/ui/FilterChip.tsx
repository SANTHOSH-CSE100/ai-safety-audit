import { Pressable, Text } from "react-native";
import { cn } from "../../utils/cn";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
}

/** A single toggle pill — for a row of them, see DateRangeFilter for the segmented-control variant. */
export function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "rounded-pill border px-3.5 py-2",
        active ? "bg-primary border-primary" : "bg-surface border-border"
      )}
    >
      <Text className={cn("text-xs font-semibold", active ? "text-white" : "text-ink")}>{label}</Text>
    </Pressable>
  );
}
