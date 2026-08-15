import { Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { Card } from "./Card";
import { colors, typography } from "../../theme";
import { cn } from "../../utils/cn";

type Tone = "primary" | "success" | "warning" | "danger" | "info" | "neutral";

const TONE_COLORS: Record<Tone, { fg: string; bg: string }> = {
  primary: { fg: colors.primary.DEFAULT, bg: colors.primary[50] },
  success: { fg: colors.success, bg: colors.successBg },
  warning: { fg: colors.warning, bg: colors.warningBg },
  danger: { fg: colors.danger, bg: colors.dangerBg },
  info: { fg: colors.info, bg: colors.infoBg },
  neutral: { fg: colors.muted, bg: colors.mutedBg },
};

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: Tone;
  className?: string;
}

/** A single KPI — icon, big number, label. Use inside a row for a scannable metrics strip. */
export function MetricCard({ icon: Icon, label, value, tone = "neutral", className }: MetricCardProps) {
  const { fg, bg } = TONE_COLORS[tone];
  return (
    <Card className={cn("flex-1 gap-3", className)}>
      <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: bg }}>
        <Icon size={18} color={fg} />
      </View>
      <View className="gap-0.5">
        <Text className={typography.metricNumber} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        <Text className={typography.caption}>{label}</Text>
      </View>
    </Card>
  );
}
