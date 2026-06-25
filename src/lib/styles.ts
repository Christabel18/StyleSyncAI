import type { StyleOption, StyleId } from "@/types";

/**
 * The seven onboarding styles from the design doc.
 * Each maps to one of the three stylist personas (Nova / Ava / Ivy).
 */
export const STYLES: StyleOption[] = [
  {
    id: "streetwear",
    name: "Streetwear",
    tagline: "Bold, layered, expressive",
    description:
      "Oversized silhouettes, sneakers, and statement layering with an urban edge.",
    swatch: ["#1b1a17", "#f8f6f1", "#5b61e8", "#b45f45"],
    persona: "nova",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    tagline: "Clean lines, quiet confidence",
    description:
      "Neutral palettes, refined basics, and intentional simplicity in every piece.",
    swatch: ["#f8f6f1", "#d8d2c6", "#8a8780", "#1b1a17"],
    persona: "ava",
  },
  {
    id: "old-money",
    name: "Old Money",
    tagline: "Timeless, tailored, understated",
    description:
      "Heritage tailoring, rich neutrals, and quietly luxurious classics.",
    swatch: ["#2f5e4e", "#e9e1cf", "#7a5c3a", "#1b1a17"],
    persona: "ivy",
  },
  {
    id: "business-casual",
    name: "Business Casual",
    tagline: "Polished, versatile, sharp",
    description:
      "Smart separates that move from the office to dinner without missing a beat.",
    swatch: ["#26303a", "#c9c2b4", "#8a8780", "#f8f6f1"],
    persona: "ivy",
  },
  {
    id: "y2k",
    name: "Y2K",
    tagline: "Playful, nostalgic, daring",
    description:
      "Low-rise, metallics, and bold early-2000s energy with a modern remix.",
    swatch: ["#e85fb0", "#5b61e8", "#c0c0c0", "#1b1a17"],
    persona: "nova",
  },
  {
    id: "clean-girl",
    name: "Clean Girl",
    tagline: "Effortless, fresh, polished",
    description:
      "Slicked-back ease, gold accents, and a dewy, put-together simplicity.",
    swatch: ["#f4ede1", "#d9b88a", "#1b1a17", "#ffffff"],
    persona: "ava",
  },
  {
    id: "casual",
    name: "Casual",
    tagline: "Comfortable, easy, everyday",
    description:
      "Relaxed staples that feel good and look effortless for any day.",
    swatch: ["#6b8fb0", "#e4ddd1", "#1b1a17", "#b45f45"],
    persona: "nova",
  },
];

export const STYLE_BY_ID: Record<StyleId, StyleOption> = STYLES.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<StyleId, StyleOption>,
);

export function getStyle(id: StyleId | undefined): StyleOption {
  return (id && STYLE_BY_ID[id]) || STYLES[0];
}
