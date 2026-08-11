import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Upload, FileText, BarChart3 } from "lucide-react-native";
import { colors } from "../../theme";

const actions = [
  { label: "Upload Video", icon: Upload, href: "/(app)/upload" },
  { label: "Reports", icon: FileText, href: "/(app)/reports" },
  { label: "Analytics", icon: BarChart3, href: "/(app)/analytics" },
] as const;

export function QuickActions() {
  return (
    <View className="flex-row gap-3 px-5">
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={() => router.push(action.href as never)}
          className="flex-1 bg-surface border border-border rounded-card items-center py-4 gap-2"
        >
          <View className="w-11 h-11 rounded-full bg-primary-50 items-center justify-center">
            <action.icon size={19} color={colors.primary.DEFAULT} />
          </View>
          <Text className="text-xs font-semibold text-ink text-center">{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
