import { ReactNode } from "react";
import { Text, View, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors, typography } from "../../theme";
import { cn } from "../../utils/cn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Overrides the action link with any node (e.g. a DemoBadge) when set. */
  right?: ReactNode;
  className?: string;
}

/** Heading for an in-page section (e.g. "Recent Uploads"), as opposed to ScreenHeader which titles the whole screen. */
export function SectionHeader({ title, subtitle, actionLabel, onAction, right, className }: SectionHeaderProps) {
  return (
    <View className={cn("flex-row items-center justify-between", className)}>
      <View className="flex-1">
        <Text className={typography.sectionTitle}>{title}</Text>
        {subtitle ? <Text className={cn(typography.caption, "mt-0.5")}>{subtitle}</Text> : null}
      </View>
      {right ? (
        right
      ) : onAction && actionLabel ? (
        <Pressable onPress={onAction} className="flex-row items-center gap-0.5" hitSlop={8}>
          <Text className="text-sm font-medium text-primary">{actionLabel}</Text>
          <ChevronRight size={14} color={colors.primary.DEFAULT} />
        </Pressable>
      ) : null}
    </View>
  );
}
