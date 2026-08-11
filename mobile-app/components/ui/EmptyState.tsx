import { Text, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { colors } from "../../theme";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16 gap-3">
      <View className="w-16 h-16 rounded-full bg-primary-50 items-center justify-center">
        <Icon size={28} color={colors.primary.DEFAULT} />
      </View>
      <Text className="text-base font-semibold text-ink text-center">{title}</Text>
      {description ? (
        <Text className="text-sm text-muted text-center">{description}</Text>
      ) : null}
      {action}
    </View>
  );
}
