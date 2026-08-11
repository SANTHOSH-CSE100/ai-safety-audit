import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText } from "lucide-react-native";
import { AppHeader } from "../../../components/layout/AppHeader";
import { FactorySelector } from "../../../components/layout/FactorySelector";
import { Card } from "../../../components/ui/Card";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { ErrorState } from "../../../components/ui/ErrorState";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ReportListItem } from "../../../features/reports/ReportListItem";
import { useReports } from "../../../features/reports/hooks";
import { useFactoryStore } from "../../../src/store/factoryStore";

export default function ReportsScreen() {
  const selected = useFactoryStore((s) => s.selected);
  const { data, isLoading, isError, refetch } = useReports(selected?.id ?? null);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader title="Reports" subtitle={data ? `${data.length} report${data.length === 1 ? "" : "s"}` : undefined} />
      <FactorySelector />

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
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          renderItem={({ item, index }) => (
            <Card padded={false} className={index === 0 ? "" : "mt-3"}>
              <ReportListItem report={item} isLast />
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
