import "../global.css";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { QueryProvider } from "../providers/QueryProvider";
import { NotificationsProvider } from "../providers/NotificationsProvider";
import { ErrorBoundary } from "../providers/ErrorBoundary";
import { useAuthStore } from "../src/store/authStore";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    hydrate().finally(() => setAppReady(true));
  }, [hydrate]);

  useEffect(() => {
    if (appReady && isHydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady, isHydrated]);

  if (!appReady || !isHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <NotificationsProvider>
            <ErrorBoundary>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(app)" />
              </Stack>
              <Toast />
            </ErrorBoundary>
          </NotificationsProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
