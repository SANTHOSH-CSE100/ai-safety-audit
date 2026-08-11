/** Tiny className joiner — avoids pulling in clsx/tailwind-merge for this scale of project. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
