import { Text, View } from "react-native";
import { cn } from "../../utils/cn";

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  className?: string;
}

export function Badge({ label, color = "#6C4CF1", bg = "#F2EFFE", className }: BadgeProps) {
  return (
    <View
      className={cn("self-start rounded-pill px-2.5 py-1", className)}
      style={{ backgroundColor: bg }}
    >
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
