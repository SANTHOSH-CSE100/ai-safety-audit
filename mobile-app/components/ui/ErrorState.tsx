import { Text, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { colors } from "../../theme";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16 gap-3">
      <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center">
        <AlertTriangle size={28} color={colors.danger} />
      </View>
      <Text className="text-base font-semibold text-ink text-center">{title}</Text>
      <Text className="text-sm text-muted text-center">{message}</Text>
      {onRetry ? (
        <Button label="Try again" variant="secondary" onPress={onRetry} className="mt-2" />
      ) : null}
    </View>
  );
}
