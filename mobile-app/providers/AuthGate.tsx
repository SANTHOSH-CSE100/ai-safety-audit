import { PropsWithChildren } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "../src/store/authStore";

/** Wrap any protected route group with this. Assumes the store has already been hydrated (see app/_layout.tsx). */
export function AuthGate({ children }: PropsWithChildren) {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  return <>{children}</>;
}

/** Inverse guard for the auth screens — if already signed in, skip straight to the dashboard. */
export function GuestGate({ children }: PropsWithChildren) {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (accessToken) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <>{children}</>;
}
