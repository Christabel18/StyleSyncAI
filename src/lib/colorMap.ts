/** P2 — Color name → HEX mapping.
 *  Azure Vision returns named buckets ("Black", "White", "Red", ...) and
 *  an accentColor as HEX without "#". This module normalizes both.
 */

export const COLOR_HEX: Record<string, string> = {
  // Neutrals
  black: "#000000",
  white: "#FFFFFF",
  gray: "#808080",
  grey: "#808080",
  silver: "#C0C0C0",
  charcoal: "#36454F",

  // Warm
  red: "#DC143C",
  pink: "#FFB6C1",
  rose: "#FF66A8",
  coral: "#FF7F50",
  orange: "#FFA500",
  peach: "#FFDAB9",
  yellow: "#FFD700",
  gold: "#FFD700",
  mustard: "#D4A017",

  // Cool
  green: "#228B22",
  olive: "#808000",
  mint: "#98FF98",
  teal: "#008080",
  blue: "#1E3A8A",
  navy: "#000080",
  sky: "#87CEEB",
  purple: "#800080",
  lavender: "#B57EDC",
  burgundy: "#800020",
  maroon: "#800000",

  // Earth
  brown: "#8B4513",
  tan: "#D2B48C",
  beige: "#F5F5DC",
  cream: "#FFFDD0",
  ivory: "#FFFFF0",
  khaki: "#C3B091",
  camel: "#C19A6B",
};

const FALLBACK_HEX = "#888888";

export function colorNameToHex(name: string): string {
  const normalized = name.toLowerCase().trim();
  return COLOR_HEX[normalized] ?? FALLBACK_HEX;
}

/** Azure Vision returns accentColor as "925A45" (no #). Normalize to "#925A45". */
export function normalizeHex(hex: string): string {
  const cleaned = hex.replace(/^#/, "").toUpperCase();
  if (/^[0-9A-F]{6}$/.test(cleaned)) return `#${cleaned}`;
  if (/^[0-9A-F]{3}$/.test(cleaned)) {
    return `#${cleaned[0]}${cleaned[0]}${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}`;
  }
  return FALLBACK_HEX;
}
