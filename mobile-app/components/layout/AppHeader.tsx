import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Bell } from "lucide-react-native";
import { colors } from "../../theme";
import { Avatar } from "../ui/Avatar";
import { useUnreadCount } from "../../features/notifications/hooks";
import { useAuthStore } from "../../src/store/authStore";

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { data } = useUnreadCount();
  const fullName = useAuthStore((s) => s.fullName) ?? "User";
  const unread = data?.count ?? 0;

  return (
    <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
      <View className="flex-1">
        <Text className="text-2xl font-bold text-ink">{title}</Text>
        {subtitle ? <Text className="text-sm text-muted mt-0.5">{subtitle}</Text> : null}
      </View>

      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => router.push("/(app)/notifications")}
          className="w-11 h-11 rounded-full bg-surface border border-border items-center justify-center"
        >
          <Bell size={19} color={colors.ink} />
          {unread > 0 ? (
            <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger items-center justify-center">
              <Text className="text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</Text>
            </View>
          ) : null}
        </Pressable>

        <Pressable onPress={() => router.push("/(app)/profile")}>
          <Avatar name={fullName} size={40} />
        </Pressable>
      </View>
    </View>
  );
}
