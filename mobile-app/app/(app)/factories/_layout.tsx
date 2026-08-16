import { Stack } from "expo-router";

/**
 * Nests `factories/index` (list) and `factories/[id]` (detail) inside their
 * own Stack. Without this, Expo Router has no layout to collapse the two
 * sibling files under, so it registers each one as its own top-level route
 * next to dashboard/upload/reports/analytics — and the parent Tabs navigator
 * (app/(app)/_layout.tsx) auto-mounts every route it discovers as a tab,
 * which is why "factories/[id]" was showing up as a broken extra tab.
 *
 * With this Stack in place, the (app) Tabs navigator only ever sees a single
 * "factories" route (this layout); [id] becomes a normal push destination
 * inside it, exactly like any other detail screen.
 */
export default function FactoriesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
