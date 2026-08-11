import { Text, View } from "react-native";
import { cn } from "../../utils/cn";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}

export function ScreenHeader({ title, subtitle, right, className }: ScreenHeaderProps) {
  return (
    <View className={cn("flex-row items-start justify-between px-5 pt-2 pb-4", className)}>
      <View className="flex-1">
        <Text className="text-2xl font-bold text-ink">{title}</Text>
        {subtitle ? <Text className="text-sm text-muted mt-0.5">{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}
