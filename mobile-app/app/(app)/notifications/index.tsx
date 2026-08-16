import { FlatList, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import { Bell } from "lucide-react-native";
import { ErrorState } from "../../../components/ui/ErrorState";
import { EmptyState } from "../../../components/ui/EmptyState";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { NotificationCard } from "../../../components/ui/NotificationCard";
import { DemoBadge } from "../../../components/ui/DemoBadge";
import { DetailHeader } from "../../../components/layout/DetailHeader";
import { isMockId } from "../../../src/mock";
import { useMarkRead, useNotifications } from "../../../features/notifications/hooks";

export default function NotificationsScreen() {
  const { data, isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkRead();
  const [refreshing, setRefreshing] = useState(false);
  const isDemo = !!data && data.length > 0 && isMockId(data[0].id);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <DetailHeader title="Notifications" right={isDemo ? <DemoBadge /> : undefined} />

      {isLoading ? (
        <View className="px-5 gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : isError ? (
        <ErrorState message="Couldn't load notifications." onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" description="We'll let you know when something needs your attention." />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onPress={() => {
                if (!item.read) markRead.mutate(item.id);
                if (item.relatedReportId) router.push(`/(app)/reports/${item.relatedReportId}` as never);
              }}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
