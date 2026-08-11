import { Component, PropsWithChildren, ReactNode } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertOctagon } from "lucide-react-native";
import { colors } from "../theme";
import { Button } from "../components/ui/Button";

interface Props extends PropsWithChildren {
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Swap for a real crash reporter (Sentry, Bugsnag) in production.
    console.error("Unhandled error in component tree:", error, info.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-1 items-center justify-center px-8 gap-4">
            <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center">
              <AlertOctagon size={28} color={colors.danger} />
            </View>
            <Text className="text-lg font-bold text-ink text-center">
              {this.props.fallbackTitle ?? "Something went wrong"}
            </Text>
            <Text className="text-sm text-muted text-center">
              {this.state.error?.message ?? "An unexpected error occurred. Please try again."}
            </Text>
            <Button label="Try again" onPress={this.reset} className="mt-2" />
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
