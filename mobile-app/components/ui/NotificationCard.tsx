import { Text, View, Pressable } from "react-native";
import { AlertTriangle, BellRing, Info } from "lucide-react-native";
import { colors, typography } from "../../theme";
import { formatRelative } from "../../utils/format";
import { cn } from "../../utils/cn";
import type { NotificationResponse } from "../../src/types/api";

/** Best-effort tone from the title text — the API doesn't carry a severity field for notifications. */
function toneFor(title: string) {
  const t = title.toLowerCase();
  if (t.includes("critical") || t.includes("failed")) return { Icon: AlertTriangle, color: colors.danger, bg: colors.dangerBg };
  if (t.includes("attention") || t.includes("warning")) return { Icon: AlertTriangle, color: colors.warning, bg: colors.warningBg };
  return { Icon: BellRing, color: colors.primary.DEFAULT, bg: colors.primary[50] };
}

interface NotificationCardProps {
  notification: NotificationResponse;
  onPress: () => void;
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const { Icon, color, bg } = toneFor(notification.title);

  return (
    <Pressable onPress={onPress} className="flex-row gap-3 py-4 border-b border-border">
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: notification.read ? colors.mutedBg : bg }}
      >
        <Icon size={16} color={notification.read ? colors.muted : color} />
      </View>
      <View className="flex-1">
        <Text className={cn(typography.body, notification.read ? "font-medium" : "font-bold")}>
          {notification.title}
        </Text>
        {notification.body ? (
          <Text className={cn(typography.caption, "mt-0.5")} numberOfLines={2}>
            {notification.body}
          </Text>
        ) : null}
        <Text className="text-[11px] text-faint mt-1">{formatRelative(notification.createdAt)}</Text>
      </View>
      {!notification.read ? <View className="w-2 h-2 rounded-full bg-primary mt-1.5" /> : null}
    </Pressable>
  );
}
