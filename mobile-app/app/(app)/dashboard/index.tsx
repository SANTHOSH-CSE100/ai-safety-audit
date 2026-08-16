import { View } from "react-native";
import { useCallback, useState } from "react";
import { Building2 } from "lucide-react-native";
import { AppHeader } from "../../../components/layout/AppHeader";
import { FactorySelector } from "../../../components/layout/FactorySelector";
import { ScreenContainer } from "../../../components/ui/ScreenContainer";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { EmptyState } from "../../../components/ui/EmptyState";
import { DashboardSummary } from "../../../features/dashboard/SummaryCards";
import { RecentUploads } from "../../../features/dashboard/RecentUploads";
import { QuickActions } from "../../../features/dashboard/QuickActions";
import { useFactories } from "../../../features/factories/hooks";
import { useAnalytics } from "../../../features/analytics/hooks";
import { useUploads } from "../../../features/uploads/hooks";
import { useFactoryStore } from "../../../src/store/factoryStore";
import { useAuthStore } from "../../../src/store/authStore";

export default function DashboardScreen() {
  const fullName = useAuthStore((s) => s.fullName);
  const factoriesQuery = useFactories();
  const selected = useFactoryStore((s) => s.selected);
  const isMockMode = useFactoryStore((s) => s.isMockMode);

  const analyticsQuery = useAnalytics(selected?.id ?? null);
  const uploadsQuery = useUploads(selected?.id ?? null);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([factoriesQuery.refetch(), analyticsQuery.refetch(), uploadsQuery.refetch()]);
    setRefreshing(false);
  }, [factoriesQuery, analyticsQuery, uploadsQuery]);

  const firstName = fullName?.split(" ")[0];

  if (factoriesQuery.isSuccess && factoriesQuery.data && factoriesQuery.data.length === 0 && !isMockMode) {
    return (
      <ScreenContainer scroll={false}>
        <AppHeader title={firstName ? `Hi, ${firstName}` : "Dashboard"} subtitle="Here's your safety overview" />
        <EmptyState
          icon={Building2}
          title="No factories yet"
          description="Ask an admin to add a factory to your account to get started."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer refreshing={refreshing} onRefresh={onRefresh}>
      <AppHeader title={firstName ? `Hi, ${firstName}` : "Dashboard"} subtitle="Here's your safety overview" />
      <FactorySelector />

      {analyticsQuery.isLoading ? (
        <View className="px-5">
          <SkeletonCard />
        </View>
      ) : analyticsQuery.isError ? (
        <ErrorState message="Couldn't load your safety summary." onRetry={() => analyticsQuery.refetch()} />
      ) : analyticsQuery.data ? (
        <DashboardSummary analytics={analyticsQuery.data} isDemo={isMockMode} />
      ) : null}

      <QuickActions />

      {uploadsQuery.data ? <RecentUploads uploads={uploadsQuery.data} isDemo={isMockMode} /> : null}
    </ScreenContainer>
  );
}
