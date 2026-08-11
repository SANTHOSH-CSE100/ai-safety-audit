/**
 * NativeWind's `tailwind.config.js` is the source of truth for className
 * styling. This file mirrors the same design tokens as plain TS constants
 * for places that can't take a className — chart libraries (gifted-charts),
 * SVG fills/strokes, and Reanimated `useAnimatedStyle` values.
 *
 * Keep this in sync with tailwind.config.js `theme.extend.colors`.
 */

export const colors = {
  primary: {
    DEFAULT: "#6C4CF1",
    50: "#F2EFFE",
    100: "#E5DFFD",
    200: "#C9BAFB",
    300: "#AD96F8",
    400: "#8F71F5",
    500: "#6C4CF1",
    600: "#5636D6",
    700: "#4228A8",
    800: "#2F1C79",
    900: "#1C114A",
  },
  background: "#F8F9FC",
  surface: "#FFFFFF",
  border: "#E9EAF2",
  muted: "#8A8DA0",
  ink: "#1A1B25",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  critical: "#DC2626",
  info: "#3B82F6",
} as const;

export const radii = {
  card: 20,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: "#1C114A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
} as const;
