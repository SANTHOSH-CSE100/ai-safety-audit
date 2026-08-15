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
  // Slightly lifted surface for panels that sit "above" a card-on-background
  // context (e.g. a stat row inside a card) without reaching for a shadow.
  surfaceElevated: "#FFFFFF",
  // Faint tinted panel — selected chips, highlighted rows, subtle sections.
  surfaceMuted: "#F4F2FC",
  border: "#E9EAF2",
  // Secondary text (labels, metadata under a title).
  muted: "#8A8DA0",
  // Tertiary text — timestamps, helper captions. Lighter than `muted`.
  faint: "#B0B2C3",
  ink: "#1A1B25",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  critical: "#DC2626",
  info: "#3B82F6",
  // Tinted backgrounds for status/severity chips and icon badges — centralized
  // here instead of scattered magic hex literals across components.
  successBg: "#F0FDF4",
  warningBg: "#FFFBEB",
  dangerBg: "#FEF2F2",
  criticalBg: "#FEE2E2",
  infoBg: "#EFF6FF",
  mutedBg: "#F3F4F6",
} as const;

// 4 / 8 / 12 / 16 / 24 / 32 / 40 spacing scale. NativeWind's default spacing
// already lines up (1=4, 2=8, 3=12, 4=16, 6=24, 8=32, 10=40) — this export
// exists for the handful of places that need raw numbers (SVG, chart libs,
// Reanimated styles) instead of className.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  card: 20,
  pill: 999,
} as const;

export const shadow = {
  // Default card elevation — used everywhere today.
  card: {
    shadowColor: "#1C114A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  // Slightly stronger — reserved for the one or two things per screen that
  // should visually lead (e.g. the primary safety-status banner).
  raised: {
    shadowColor: "#1C114A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;
