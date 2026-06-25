import type { StyleVibe, AssistantName } from "@/types";

/** Display metadata for each StyleVibe */
export interface StyleMeta {
  id: StyleVibe;
  name: string;
  tagline: string;
  description: string;
  swatch: string[];
  assistant: AssistantName;
}

export const STYLES: StyleMeta[] = [
  {
    id: "streetwear",
    name: "Streetwear",
    tagline: "Bold, layered, expressive",
    description: "Oversized silhouettes, sneakers, and statement layering with an urban edge.",
    swatch: ["#000000", "#FFFFFF", "#5b61e8", "#FF0000"],
    assistant: "Nova",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    tagline: "Clean lines, quiet confidence",
    description: "Neutral palettes, refined basics, and intentional simplicity.",
    swatch: ["#FFFFFF", "#808080", "#000000", "#F5F5F5"],
    assistant: "Ava",
  },
  {
    id: "classic",
    name: "Classic",
    tagline: "Timeless, tailored, sharp",
    description: "Heritage tailoring, rich neutrals, and quietly luxurious classics.",
    swatch: ["#000080", "#F5F5DC", "#8B4513", "#000000"],
    assistant: "Ivy",
  },
  {
    id: "bohemian",
    name: "Bohemian",
    tagline: "Free-spirited, earthy, layered",
    description: "Flowing silhouettes, earth tones, and artisan details.",
    swatch: ["#8B4513", "#FFFDD0", "#808000", "#D2691E"],
    assistant: "Ivy",
  },
  {
    id: "sporty",
    name: "Sporty",
    tagline: "Athletic, clean, functional",
    description: "Performance pieces worn with effortless style.",
    swatch: ["#000000", "#FFFFFF", "#0000FF", "#FF0000"],
    assistant: "Nova",
  },
  {
    id: "preppy",
    name: "Preppy",
    tagline: "Polished, collegiate, smart",
    description: "Smart separates, heritage prints, and refined classics.",
    swatch: ["#000080", "#FFFFFF", "#008000", "#C0C0C0"],
    assistant: "Ava",
  },
  {
    id: "edgy",
    name: "Edgy",
    tagline: "Rebellious, dark, bold",
    description: "Leather, studs, and unexpected contrasts.",
    swatch: ["#000000", "#FF0000", "#C0C0C0", "#1a1a1a"],
    assistant: "Nova",
  },
  {
    id: "romantic",
    name: "Romantic",
    tagline: "Feminine, soft, dreamy",
    description: "Flowing fabrics, florals, and delicate details.",
    swatch: ["#FFC0CB", "#FFFFFF", "#FFFDD0", "#E8D5C4"],
    assistant: "Ava",
  },
];

export const STYLE_BY_ID: Record<StyleVibe, StyleMeta> = STYLES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<StyleVibe, StyleMeta>,
);

export function getStyleMeta(id: StyleVibe): StyleMeta {
  return STYLE_BY_ID[id] ?? STYLES[0];
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
    title: "Streetwear stylist",
    blurb: "Warm, encouraging, always finds something to love first.",
    color: "#5b61e8",
    bg: "#eef0fd",
  },
  Ava: {
    name: "Ava",
    emoji: "◍",
    title: "Fashion-forward stylist",
    blurb: "Bold and direct — she tells it like it is, constructively.",
    color: "#7c8a72",
    bg: "#eff2ed",
  },
  Ivy: {
    name: "Ivy",
    emoji: "❦",
    title: "Classic & analytical stylist",
    blurb: "Precise, data-driven, backed by color theory and proportion.",
    color: "#2f5e4e",
    bg: "#e8f0ee",
  },
};
