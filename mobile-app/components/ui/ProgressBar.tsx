import { View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { colors } from "../../theme";

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color = colors.primary.DEFAULT, height = 8 }: ProgressBarProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${withTiming(Math.max(0, Math.min(1, progress)) * 100)}%`,
  }));

  return (
    <View
      style={{ height, borderRadius: height / 2, backgroundColor: colors.border, overflow: "hidden" }}
    >
      <Animated.View
        style={[{ height, borderRadius: height / 2, backgroundColor: color }, animatedStyle]}
      />
    </View>
  );
}
