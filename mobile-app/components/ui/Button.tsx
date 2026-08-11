import { ActivityIndicator, Pressable, PressableProps, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { cn } from "../../utils/cn";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends Omit<PressableProps, "children"> {
  label: string;
  variant?: Variant;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, { container: string; text: string }> = {
  primary: { container: "bg-primary", text: "text-white" },
  secondary: { container: "bg-primary-50", text: "text-primary-700" },
  ghost: { container: "bg-transparent border border-border", text: "text-ink" },
  danger: { container: "bg-danger", text: "text-white" },
};

export function Button({
  label,
  variant = "primary",
  loading,
  icon,
  fullWidth,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);
  const style = variantStyles[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => (scale.value = withSpring(0.97, { damping: 15 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 15 }))}
      disabled={disabled || loading}
      className={cn(
        "flex-row items-center justify-center rounded-pill px-5 py-3.5 gap-2",
        style.container,
        (disabled || loading) && "opacity-50",
        fullWidth && "w-full",
        className
      )}
      style={animatedStyle}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" || variant === "danger" ? "#fff" : "#6C4CF1"} />
      ) : (
        <>
          {icon}
          <Text className={cn("text-base font-semibold", style.text)}>{label}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}
