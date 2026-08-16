import { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText } from "lucide-react-native";
import { AppHeader } from "../../../components/layout/AppHeader";
import { FactorySelector } from "../../../components/layout/FactorySelector";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { EmptyState } from "../../../components/ui/EmptyState";
import { DemoBadge } from "../../../components/ui/DemoBadge";
import { ReportCard } from "../../../components/ui/ReportCard";
import { useReports } from "../../../features/reports/hooks";
import { useFactoryStore } from "../../../src/store/factoryStore";

export default function ReportsScreen() {
  const selected = useFactoryStore((s) => s.selected);
  const isMockMode = useFactoryStore((s) => s.isMockMode);
  const { data, isLoading, isError, refetch } = useReports(selected?.id ?? null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader title="Reports" subtitle={data ? `${data.length} report${data.length === 1 ? "" : "s"}` : undefined} />
      <FactorySelector />
      {isMockMode && data && data.length > 0 ? (
        <View className="px-5 pb-3">
          <DemoBadge />
        </View>
      ) : null}

      {isLoading ? (
        <View className="px-5 gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : isError ? (
        <ErrorState message="Couldn't load reports." onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports yet"
          description="Upload a video to generate your first safety report."
        />
      ) : (
        <FlatList
          data={[...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt))}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 12 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => <ReportCard report={item} />}
        />
      )}
    </SafeAreaView>
  );
}
