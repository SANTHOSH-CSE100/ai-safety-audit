import { Stack } from "expo-router";

/**
 * Nests `reports/index` (list) and `reports/[id]` (detail) inside their own
 * Stack, for the same reason as `factories/_layout.tsx` — see that file for
 * the full explanation of why this is required to keep dynamic routes out
 * of the bottom tab bar.
 */
export default function ReportsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
