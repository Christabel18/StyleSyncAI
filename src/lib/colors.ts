/** Maps human color names (from analysis) to display swatches. */
const COLOR_MAP: Record<string, string> = {
  white: "#ffffff",
  black: "#1b1a17",
  ink: "#1b1a17",
  grey: "#9a958c",
  gray: "#9a958c",
  charcoal: "#3a3d42",
  silver: "#c8ccd1",
  beige: "#e6dcc8",
  cream: "#f4ede1",
  tan: "#d9c3a3",
  brown: "#7a5c3a",
  camel: "#c19a6b",
  navy: "#28324a",
  blue: "#5b7fb0",
  green: "#4a7a5e",
  sage: "#7c8a72",
  olive: "#6b6a3a",
  red: "#b4434a",
  pink: "#e07fae",
  purple: "#7a5ea8",
  gold: "#caa24a",
  yellow: "#e6c84a",
  orange: "#d2814a",
  clay: "#b45f45",
};

export function colorToHex(name: string): string {
  return COLOR_MAP[name.toLowerCase().trim()] ?? "#c9c2b4";
}

/** Returns a readable text color (ink or white) for a given background hex. */
export function readableOn(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return "#1b1a17";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1b1a17" : "#ffffff";
}
