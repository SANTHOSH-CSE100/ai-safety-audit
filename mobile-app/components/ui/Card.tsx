import { View, ViewProps } from "react-native";
import { shadow } from "../../theme";
import { cn } from "../../utils/cn";

interface CardProps extends ViewProps {
  padded?: boolean;
}

export function Card({ padded = true, className, style, ...props }: CardProps) {
  return (
    <View
      className={cn("bg-surface rounded-card border border-border", padded && "p-4", className)}
      style={[shadow.card, style]}
      {...props}
    />
  );
}
