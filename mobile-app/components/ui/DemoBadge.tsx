import { Text, View } from "react-native";
import { Sparkles } from "lucide-react-native";
import { colors } from "../../theme";
import { cn } from "../../utils/cn";

/**
 * Marks a section as showing demo/mock data instead of real backend rows —
 * used whenever the mock-data fallback in src/mock/ is active, so it's never
 * mistaken for real production data. See src/mock/demoMode.ts.
 */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <View
      className={cn("flex-row items-center gap-1 self-start rounded-pill px-2.5 py-1", className)}
      style={{ backgroundColor: colors.infoBg }}
    >
      <Sparkles size={11} color={colors.info} />
      <Text className="text-[10px] font-bold tracking-wide" style={{ color: colors.info }}>
        DEMO DATA
      </Text>
    </View>
  );
}
