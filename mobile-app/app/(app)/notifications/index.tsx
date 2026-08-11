import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import { ArrowLeft, Bell, BellRing } from "lucide-react-native";
import { ErrorState } from "../../../components/ui/ErrorState";
import { EmptyState } from "../../../components/ui/EmptyState";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { colors } from "../../../theme";
import { formatRelative } from "../../../utils/format";
import { useMarkRead, useNotifications } from "../../../features/notifications/hooks";
import type { NotificationResponse } from "../../../src/types/api";

export default function NotificationsScreen() {
  const { data, isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkRead();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center px-5 pt-3 pb-2">
        <Pressable onPress={() => router.back()} hitSlop={12} className="w-10 h-10 items-center justify-center -ml-2">
          <ArrowLeft size={22} color={colors.ink} />
        </Pressable>
        <Text className="text-lg font-bold text-ink ml-1">Notifications</Text>
      </View>

      {isLoading ? (
        <View className="px-5 gap-3"><SkeletonCard /><SkeletonCard /></View>
      ) : isError ? (
        <ErrorState message="Couldn't load notifications." onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" description="We'll let you know when something needs your attention." />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <NotificationRow
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

function NotificationRow({
  notification,
  onPress,
}: {
  notification: NotificationResponse;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row gap-3 py-4 border-b border-border">
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: notification.read ? "#F3F4F6" : colors.primary[50] }}
      >
        <BellRing size={16} color={notification.read ? colors.muted : colors.primary.DEFAULT} />
      </View>
      <View className="flex-1">
        <Text className={`text-sm ${notification.read ? "font-medium text-ink" : "font-bold text-ink"}`}>
          {notification.title}
        </Text>
        {notification.body ? (
          <Text className="text-xs text-muted mt-0.5" numberOfLines={2}>{notification.body}</Text>
        ) : null}
        <Text className="text-[11px] text-muted mt-1">{formatRelative(notification.createdAt)}</Text>
      </View>
      {!notification.read ? <View className="w-2 h-2 rounded-full bg-primary mt-1.5" /> : null}
    </Pressable>
  );
}
