import { useEffect } from "react";
import { View, ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "../../utils/cn";

export function Skeleton({ className, style, ...props }: ViewProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className={cn("bg-border rounded-xl", className)}
      style={[animatedStyle, style]}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="bg-surface rounded-card border border-border p-4 gap-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-24 w-full" />
    </View>
  );
}
