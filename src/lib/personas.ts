import type { Persona, PersonaId, StyleId } from "@/types";

/**
 * The three stylist personas from the design doc.
 * Nova → Streetwear, Ava → Minimalist, Ivy → Old Money.
 */
export const PERSONAS: Record<PersonaId, Persona> = {
  nova: {
    id: "nova",
    name: "Nova",
    emoji: "✦",
    title: "Streetwear stylist",
    blurb: "Bold, trend-forward, and all about a strong silhouette.",
    accentVar: "var(--color-nova)",
    greeting: "Nova here 👋",
  },
  ava: {
    id: "ava",
    name: "Ava",
    emoji: "◍",
    title: "Minimalist stylist",
    blurb: "Calm, precise, and devoted to quiet, intentional looks.",
    accentVar: "var(--color-ava)",
    greeting: "Hi, it's Ava ✿",
  },
  ivy: {
    id: "ivy",
    name: "Ivy",
    emoji: "❦",
    title: "Old money stylist",
    blurb: "Refined, classic, and a champion of timeless tailoring.",
    accentVar: "var(--color-ivy)",
    greeting: "Ivy, at your service ❦",
  },
};

/** Maps every onboarding style to the persona that hosts it. */
export const STYLE_TO_PERSONA: Record<StyleId, PersonaId> = {
  streetwear: "nova",
  y2k: "nova",
  casual: "nova",
  minimalist: "ava",
  "clean-girl": "ava",
  "old-money": "ivy",
  "business-casual": "ivy",
};

export function personaForStyle(style: StyleId | undefined): Persona {
  const id = (style && STYLE_TO_PERSONA[style]) || "nova";
  return PERSONAS[id];
}
