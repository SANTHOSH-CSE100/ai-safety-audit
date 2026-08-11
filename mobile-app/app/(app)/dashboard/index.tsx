import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { AppHeader } from "../../../components/layout/AppHeader";
import { FactorySelector } from "../../../components/layout/FactorySelector";
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
import { Building2 } from "lucide-react-native";

export default function DashboardScreen() {
  const fullName = useAuthStore((s) => s.fullName);
  const factoriesQuery = useFactories();
  const selected = useFactoryStore((s) => s.selected);

  const analyticsQuery = useAnalytics(selected?.id ?? null);
  const uploadsQuery = useUploads(selected?.id ?? null);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      factoriesQuery.refetch(),
      analyticsQuery.refetch(),
      uploadsQuery.refetch(),
    ]);
    setRefreshing(false);
  }, [factoriesQuery, analyticsQuery, uploadsQuery]);

  const firstName = fullName?.split(" ")[0];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader title={firstName ? `Hi, ${firstName}` : "Dashboard"} subtitle="Here's your safety overview" />

      {factoriesQuery.isSuccess && factoriesQuery.data.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No factories yet"
          description="Ask an admin to add a factory to your account to get started."
        />
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 32, gap: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <FactorySelector />

          {analyticsQuery.isLoading ? (
            <View className="px-5">
              <SkeletonCard />
            </View>
          ) : analyticsQuery.isError ? (
            <ErrorState message="Couldn't load your safety summary." onRetry={() => analyticsQuery.refetch()} />
          ) : analyticsQuery.data ? (
            <DashboardSummary analytics={analyticsQuery.data} />
          ) : null}

          <QuickActions />

          {uploadsQuery.data ? <RecentUploads uploads={uploadsQuery.data} /> : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
