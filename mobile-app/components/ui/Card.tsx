import { View, ViewProps, ViewStyle } from "react-native";
import { shadow } from "../../theme";
import { cn } from "../../utils/cn";

type Elevation = "flat" | "subtle" | "raised";

const ELEVATION_STYLE: Record<Elevation, ViewStyle> = {
  flat: shadow.flat,
  subtle: shadow.card,
  raised: shadow.raised,
};

interface CardProps extends ViewProps {
  padded?: boolean;
  /**
   * Visual weight. "subtle" (default) is the existing card look everywhere.
   * Use "flat" for list-row containers that shouldn't compete with metric/hero
   * cards, "raised" for the one or two things per screen that should lead
   * (see SafetyScoreCard).
   */
  elevation?: Elevation;
}

export function Card({ padded = true, elevation = "subtle", className, style, ...props }: CardProps) {
  return (
    <View
      className={cn("bg-surface rounded-card border border-border", padded && "p-4", className)}
      style={[ELEVATION_STYLE[elevation], style]}
      {...props}
    />
  );
}
