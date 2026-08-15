/**
 * Named type-scale tokens as NativeWind className strings, so every screen
 * reaches for the same handful of text styles instead of picking font sizes
 * ad hoc. Pair with `theme/index.ts` colors when a component can't take a
 * className (e.g. inline SVG/chart text).
 *
 * Hierarchy, largest to smallest:
 *   screenTitle   — top of a screen ("Dashboard", "Analytics")
 *   sectionTitle  — a labeled group within a screen ("Recent Uploads")
 *   cardTitle     — the heading inside a card
 *   metricNumber  — the big number in a stat/metric card
 *   body          — default readable text
 *   secondaryText — supporting text, one shade quieter than body
 *   caption       — timestamps, helper text, the smallest readable size
 *   buttonText    — label inside a button
 *   badgeText     — label inside a pill/badge
 */
export const typography = {
  screenTitle: "text-2xl font-bold text-ink",
  sectionTitle: "text-base font-bold text-ink",
  cardTitle: "text-sm font-semibold text-ink",
  metricNumber: "text-[28px] leading-8 font-extrabold text-ink",
  body: "text-sm text-ink",
  secondaryText: "text-sm text-muted",
  caption: "text-xs text-muted",
  buttonText: "text-base font-semibold",
  badgeText: "text-xs font-semibold",
} as const;
