import { View } from "react-native";
import { ShieldAlert, Upload as UploadIcon } from "lucide-react-native";
import { SafetyScoreCard } from "../../components/ui/SafetyScoreCard";
import { MetricCard } from "../../components/ui/MetricCard";
import { DemoBadge } from "../../components/ui/DemoBadge";
import type { AnalyticsSummaryResponse } from "../../src/types/api";

export function DashboardSummary({
  analytics,
  isDemo,
}: {
  analytics: AnalyticsSummaryResponse;
  isDemo?: boolean;
}) {
  return (
    <View className="px-5 gap-3">
      {isDemo ? <DemoBadge className="mb-0.5" /> : null}
      <SafetyScoreCard score={analytics.avgSafetyScoreLast30Days} />
      <View className="flex-row gap-3">
        <MetricCard
          icon={ShieldAlert}
          label="Violations (30d)"
          value={analytics.totalViolationsLast30Days}
          tone={analytics.totalViolationsLast30Days > 0 ? "danger" : "success"}
        />
        <MetricCard icon={UploadIcon} label="Uploads (30d)" value={analytics.totalUploadsLast30Days} tone="primary" />
      </View>
    </View>
  );
}
