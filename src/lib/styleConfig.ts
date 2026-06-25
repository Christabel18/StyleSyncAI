import type { StyleVibe, AssistantName } from "@/types";

/** Display metadata for each StyleVibe */
export interface StyleMeta {
  id: StyleVibe;
  name: string;
  tagline: string;
  description: string;
  swatch: string[];
  assistant: AssistantName;
  emoji: string;
}

/**
 * 10 gender-neutral, globally-recognised fashion styles.
 * Replacing the old 8 (which skewed feminine with "romantic" and "clean-girl").
 *
 * ⚠️  CROSS-TEAM NOTE (P3/P4):
 * StyleVibe values changed. See docs/CROSS_TEAM_CHANGES.md for required updates
 * to /api/recommend STYLE_ITEMS and the Supabase style_vibe enum/check constraint.
 */
export const STYLES: StyleMeta[] = [
  {
    id: "streetwear",
    name: "Streetwear",
    tagline: "Urban, bold, expressive",
    description: "Oversized silhouettes, sneaker culture, graphic tees, cargo pants, and statement layering.",
    swatch: ["#000000", "#FFFFFF", "#5b61e8", "#FF0000"],
    assistant: "Nova",
    emoji: "🔥",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    tagline: "Clean lines, quiet confidence",
    description: "Neutral palettes, refined basics, intentional simplicity. Less but better.",
    swatch: ["#FFFFFF", "#d4cfc7", "#000000", "#F5F5F5"],
    assistant: "Ava",
    emoji: "🤍",
  },
  {
    id: "classic",
    name: "Classic",
    tagline: "Timeless, tailored, sharp",
    description: "Heritage tailoring, trench coats, loafers, and pieces that never go out of style.",
    swatch: ["#000080", "#F5F5DC", "#8B4513", "#000000"],
    assistant: "Ivy",
    emoji: "✨",
  },
  {
    id: "edgy",
    name: "Edgy",
    tagline: "Dark, rebellious, unexpected",
    description: "Leather, studs, chains, ripped denim, and bold silhouettes with a punk influence.",
    swatch: ["#000000", "#FF0000", "#C0C0C0", "#1a1a1a"],
    assistant: "Nova",
    emoji: "🖤",
  },
  {
    id: "sporty",
    name: "Sporty",
    tagline: "Athletic meets effortless",
    description: "Performance pieces styled for everyday — tracksuits, sneakers, and clean athletic wear.",
    swatch: ["#000000", "#FFFFFF", "#0000FF", "#FF6B00"],
    assistant: "Nova",
    emoji: "⚡",
  },
  {
    id: "preppy",
    name: "Preppy",
    tagline: "Collegiate, polished, smart",
    description: "Polo shirts, chinos, cable knits, blazers, and heritage patterns like plaid and gingham.",
    swatch: ["#000080", "#FFFFFF", "#006400", "#C0C0C0"],
    assistant: "Ivy",
    emoji: "🎀",
  },
  {
    id: "bohemian",
    name: "Bohemian",
    tagline: "Free-spirited, earthy, layered",
    description: "Flowing fabrics, earth tones, artisan jewelry, wide-brim hats, and relaxed layers.",
    swatch: ["#8B4513", "#FFFDD0", "#808000", "#D2691E"],
    assistant: "Ivy",
    emoji: "🌿",
  },
  {
    id: "business",
    name: "Business",
    tagline: "Power dressing, refined edge",
    description: "Sharp suiting, structured blazers, tailored trousers, and confident, boardroom-ready looks.",
    swatch: ["#26303a", "#E8DCC8", "#7a5c3a", "#FFFFFF"],
    assistant: "Ivy",
    emoji: "💼",
  },
  {
    id: "avant-garde",
    name: "Avant-garde",
    tagline: "Experimental, high fashion, fearless",
    description: "Unconventional cuts, unexpected proportions, and fashion-week energy that challenges norms.",
    swatch: ["#000000", "#9b5de5", "#f15bb5", "#FFFFFF"],
    assistant: "Ava",
    emoji: "🎭",
  },
  {
    id: "casual-cool",
    name: "Casual Cool",
    tagline: "Effortless, relaxed, everyday",
    description: "Well-fitted jeans, clean tees, denim jackets, and staples that look good without trying.",
    swatch: ["#6b8fb0", "#e4ddd1", "#1b1a17", "#b45f45"],
    assistant: "Nova",
    emoji: "😎",
  },
];

export const STYLE_BY_ID: Record<StyleVibe, StyleMeta> = STYLES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<StyleVibe, StyleMeta>,
);

export function getStyleMeta(id: StyleVibe | string | undefined): StyleMeta {
  return (id && STYLE_BY_ID[id as StyleVibe]) || STYLES[0];
}

/** Persona display config */
export interface PersonaMeta {
  name: AssistantName;
  emoji: string;
  title: string;
  blurb: string;
  color: string;
  bg: string;
}

export const PERSONAS: Record<AssistantName, PersonaMeta> = {
  Nova: {
    name: "Nova",
    emoji: "✦",
    title: "Street & casual stylist",
    blurb: "Warm, encouraging, always finds something to love first.",
    color: "#5b61e8",
    bg: "#eef0fd",
  },
  Ava: {
    name: "Ava",
    emoji: "◍",
    title: "Creative & editorial stylist",
    blurb: "Bold and direct — she tells it like it is, constructively.",
    color: "#7c8a72",
    bg: "#eff2ed",
  },
  Ivy: {
    name: "Ivy",
    emoji: "❦",
    title: "Classic & refined stylist",
    blurb: "Precise, data-driven, backed by color theory and proportion.",
    color: "#2f5e4e",
    bg: "#e8f0ee",
  },
};

/** Map style → persona */
export const STYLE_TO_PERSONA: Record<StyleVibe, AssistantName> = {
  streetwear: "Nova",
  edgy: "Nova",
  sporty: "Nova",
  "casual-cool": "Nova",
  minimalist: "Ava",
  "avant-garde": "Ava",
  classic: "Ivy",
  preppy: "Ivy",
  bohemian: "Ivy",
  business: "Ivy",
};
