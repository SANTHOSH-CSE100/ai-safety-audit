import { ReactNode } from "react";
import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "../../theme";

interface DetailHeaderProps {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}

/**
 * Shared header for stack/detail subscreens (not a bottom tab): Factory Detail,
 * Report Detail, Notifications, Profile. Keeps back-button size, title
 * typography, and right-slot alignment identical across all four instead of
 * each screen hand-rolling its own header row.
 *
 * Layout: [Back]   Title   [optional right]
 */
export function DetailHeader({ title, onBack, right }: DetailHeaderProps) {
  return (
    <View className="flex-row items-center px-5 pt-3 pb-2">
      <Pressable
        onPress={onBack ?? (() => router.back())}
        hitSlop={12}
        className="w-10 h-10 items-center justify-center -ml-2"
      >
        <ArrowLeft size={22} color={colors.ink} />
      </Pressable>
      <Text className="flex-1 text-lg font-bold text-ink text-center" numberOfLines={1}>
        {title}
      </Text>
      <View className="min-w-[40px] items-end">{right}</View>
    </View>
  );
}
