import { Text, View } from "react-native";
import { TrendingDown, TrendingUp, ShieldAlert } from "lucide-react-native";
import { Card } from "../../components/ui/Card";
import { ScoreRing } from "../../components/ui/ScoreRing";
import { colors } from "../../theme";
import type { AnalyticsSummaryResponse } from "../../src/types/api";

export function DashboardSummary({ analytics }: { analytics: AnalyticsSummaryResponse }) {
  return (
    <View className="flex-row gap-3 px-5">
      <Card className="flex-1 items-center gap-2">
        <ScoreRing score={analytics.avgSafetyScoreLast30Days} size={84} label="Safety" />
        <Text className="text-xs text-muted text-center">30-day average</Text>
      </Card>

      <View className="flex-1 gap-3">
        <Card className="flex-row items-center gap-3 py-3.5">
          <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center">
            <ShieldAlert size={18} color={colors.danger} />
          </View>
          <View>
            <Text className="text-lg font-bold text-ink">{analytics.totalViolationsLast30Days}</Text>
            <Text className="text-xs text-muted">Violations (30d)</Text>
          </View>
        </Card>

        <Card className="flex-row items-center gap-3 py-3.5">
          <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center">
            {analytics.totalUploadsLast30Days > 0 ? (
              <TrendingUp size={18} color={colors.primary.DEFAULT} />
            ) : (
              <TrendingDown size={18} color={colors.muted} />
            )}
          </View>
          <View>
            <Text className="text-lg font-bold text-ink">{analytics.totalUploadsLast30Days}</Text>
            <Text className="text-xs text-muted">Uploads (30d)</Text>
          </View>
        </Card>
      </View>
    </View>
  );
}
