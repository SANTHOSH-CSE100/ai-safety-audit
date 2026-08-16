import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Upload, FileText, BarChart3 } from "lucide-react-native";
import { colors } from "../../theme";

// Labeled and captioned as task shortcuts (what to do next), not as a second
// set of tab-bar destinations — same three routes as three of the five tabs,
// but framed around an action rather than a screen name.
const actions = [
  { label: "Upload Safety Video", caption: "Add new footage", icon: Upload, href: "/(app)/upload" },
  { label: "Review Reports", caption: "See latest findings", icon: FileText, href: "/(app)/reports" },
  { label: "View Analytics", caption: "Track safety trends", icon: BarChart3, href: "/(app)/analytics" },
] as const;

export function QuickActions() {
  return (
    <View className="flex-row gap-3 px-5">
      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={() => router.push(action.href as never)}
          className="flex-1 bg-surface border border-border rounded-card items-center py-4 px-2 gap-2"
        >
          <View className="w-11 h-11 rounded-full bg-primary-50 items-center justify-center">
            <action.icon size={19} color={colors.primary.DEFAULT} />
          </View>
          <View className="gap-0.5">
            <Text className="text-xs font-semibold text-ink text-center" numberOfLines={2}>
              {action.label}
            </Text>
            <Text className="text-[10px] text-muted text-center" numberOfLines={1}>
              {action.caption}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
