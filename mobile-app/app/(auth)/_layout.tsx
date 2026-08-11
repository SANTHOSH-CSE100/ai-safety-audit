import { Stack } from "expo-router";
import { GuestGate } from "../../providers/AuthGate";

export default function AuthLayout() {
  return (
    <GuestGate>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </GuestGate>
  );
}
