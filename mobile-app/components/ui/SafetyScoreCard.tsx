import { Text, View } from "react-native";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react-native";
import { Card } from "./Card";
import { ScoreRing } from "./ScoreRing";
import { colors, shadow, typography } from "../../theme";

function statusFor(score: number) {
  if (score >= 75) {
    return {
      label: "All Clear",
      description: "Safety performance is healthy across recent audits.",
      icon: ShieldCheck,
      tone: colors.success,
      bg: colors.successBg,
    };
  }
  if (score >= 50) {
    return {
      label: "Attention Needed",
      description: "A few issues need follow-up soon.",
      icon: ShieldAlert,
      tone: colors.warning,
      bg: colors.warningBg,
    };
  }
  return {
    label: "Critical",
    description: "Immediate action required on recent violations.",
    icon: ShieldX,
    tone: colors.danger,
    bg: colors.dangerBg,
  };
}

interface SafetyScoreCardProps {
  score: number;
  subtitle?: string;
}

/**
 * The dashboard's #1 element — answers "how safe is my factory right now?"
 * in one glance. Deliberately the most visually prominent card on the
 * screen (raised shadow, status banner) so it always reads as the lead.
 */
export function SafetyScoreCard({ score, subtitle = "30-day average" }: SafetyScoreCardProps) {
  const status = statusFor(score);
  const Icon = status.icon;

  return (
    <Card style={shadow.raised} className="gap-4">
      <View
        className="flex-row items-center gap-1.5 self-start rounded-pill px-3 py-1.5"
        style={{ backgroundColor: status.bg }}
      >
        <Icon size={13} color={status.tone} />
        <Text className="text-xs font-bold" style={{ color: status.tone }}>
          {status.label}
        </Text>
      </View>

      <View className="flex-row items-center gap-4">
        <ScoreRing score={score} size={92} strokeWidth={10} />
        <View className="flex-1 gap-1">
          <Text className={typography.sectionTitle}>Overall Safety Score</Text>
          <Text className={typography.secondaryText}>{status.description}</Text>
          <Text className={typography.caption}>{subtitle}</Text>
        </View>
      </View>
    </Card>
  );
}
