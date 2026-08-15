import { PropsWithChildren } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { cn } from "../../utils/cn";

interface ScreenContainerProps extends PropsWithChildren {
  /** ScrollView with a gap-5 stack (default) — pass false for screens that render their own FlatList. */
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  edges?: readonly Edge[];
  contentClassName?: string;
  className?: string;
}

/** Standard screen shell: SafeAreaView + background + (optionally) a scrollable, evenly-spaced content stack. */
export function ScreenContainer({
  children,
  scroll = true,
  refreshing,
  onRefresh,
  edges = ["top"],
  contentClassName,
  className,
}: ScreenContainerProps) {
  return (
    <SafeAreaView className={cn("flex-1 bg-background", className)} edges={edges as Edge[]}>
      {scroll ? (
        <ScrollView
          refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className={cn("gap-5", contentClassName)}>{children}</View>
        </ScrollView>
      ) : (
        <View className={cn("flex-1", contentClassName)}>{children}</View>
      )}
    </SafeAreaView>
  );
}
