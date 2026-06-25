/**
 * Vibe Quiz — Pinterest-style style discovery.
 * 10 questions × 4 cards each. Each card carries hidden StyleVibe weights.
 * After all 10 questions, weights are tallied and the top style is returned.
 */
import type { StyleVibe } from "@/types";

export type StyleWeights = Partial<Record<StyleVibe, number>>;

export interface VibeCard {
  id: string;
  emoji: string;
  label: string;
  sub: string;
  gradient: [string, string]; // [from, to]
  weights: StyleWeights;
}

export interface VibeQuestion {
  id: string;
  question: string;
  hint: string;
  cards: [VibeCard, VibeCard, VibeCard, VibeCard];
}

export const QUIZ: VibeQuestion[] = [
  {
    id: "q1",
    question: "What's your go-to footwear?",
    hint: "Pick everything that resonates — you can choose more than one.",
    cards: [
      {
        id: "q1-chunky-sneakers",
        emoji: "👟",
        label: "Chunky sneakers",
        sub: "Bold soles, loud energy",
        gradient: ["#5b61e8", "#9b5de5"],
        weights: { streetwear: 2, sporty: 1, edgy: 1 },
      },
      {
        id: "q1-leather-boots",
        emoji: "🥾",
        label: "Leather boots",
        sub: "Tough, grounded, statement",
        gradient: ["#1a1a1a", "#b45f45"],
        weights: { edgy: 2, "casual-cool": 1, bohemian: 1 },
      },
      {
        id: "q1-clean-trainers",
        emoji: "👞",
        label: "Clean white trainers",
        sub: "Simple, fresh, versatile",
        gradient: ["#e8e4dc", "#c9c2b4"],
        weights: { minimalist: 2, "casual-cool": 2 },
      },
      {
        id: "q1-loafers",
        emoji: "🥿",
        label: "Loafers or oxfords",
        sub: "Polished, structured, classic",
        gradient: ["#8B4513", "#F5F5DC"],
        weights: { classic: 2, preppy: 2, business: 1 },
      },
    ],
  },
  {
    id: "q2",
    question: "What's your signature layer?",
    hint: "The piece you reach for every time.",
    cards: [
      {
        id: "q2-oversized-hoodie",
        emoji: "🧥",
        label: "Oversized hoodie",
        sub: "Cosy, relaxed, effortless",
        gradient: ["#000000", "#5b61e8"],
        weights: { streetwear: 2, "casual-cool": 2, sporty: 1 },
      },
      {
        id: "q2-blazer",
        emoji: "🕴️",
        label: "Tailored blazer",
        sub: "Sharp, structured, intentional",
        gradient: ["#26303a", "#E8DCC8"],
        weights: { business: 2, classic: 2, minimalist: 1 },
      },
      {
        id: "q2-leather-jacket",
        emoji: "🤘",
        label: "Leather or moto jacket",
        sub: "Edge, attitude, contrast",
        gradient: ["#1a1a1a", "#FF0000"],
        weights: { edgy: 3, streetwear: 1 },
      },
      {
        id: "q2-linen-shirt",
        emoji: "🌾",
        label: "Flowy linen or knit",
        sub: "Relaxed, textured, earthy",
        gradient: ["#D2B48C", "#808000"],
        weights: { bohemian: 3, "casual-cool": 1 },
      },
    ],
  },
  {
    id: "q3",
    question: "Your colour world is…",
    hint: "The palette that just feels like you.",
    cards: [
      {
        id: "q3-neutrals",
        emoji: "🤍",
        label: "All neutrals",
        sub: "Cream, grey, beige, black",
        gradient: ["#f8f6f1", "#8a8780"],
        weights: { minimalist: 3, classic: 1, business: 1 },
      },
      {
        id: "q3-bold",
        emoji: "🎨",
        label: "Bold & saturated",
        sub: "Big colour, big statement",
        gradient: ["#f15bb5", "#fee440"],
        weights: { "avant-garde": 2, streetwear: 2, sporty: 1 },
      },
      {
        id: "q3-earth",
        emoji: "🌍",
        label: "Earth tones",
        sub: "Rust, terracotta, olive, sand",
        gradient: ["#8B4513", "#D2B48C"],
        weights: { bohemian: 3, "casual-cool": 1 },
      },
      {
        id: "q3-monochrome",
        emoji: "🖤",
        label: "All black everything",
        sub: "Clean, dark, effortless",
        gradient: ["#1a1a1a", "#4a4842"],
        weights: { edgy: 2, minimalist: 2, "avant-garde": 1 },
      },
    ],
  },
  {
    id: "q4",
    question: "How do your clothes fit?",
    hint: "Your default silhouette.",
    cards: [
      {
        id: "q4-oversized",
        emoji: "📦",
        label: "Oversized & relaxed",
        sub: "Volume, comfort, swagger",
        gradient: ["#000000", "#9b5de5"],
        weights: { streetwear: 3, "casual-cool": 1 },
      },
      {
        id: "q4-fitted",
        emoji: "📐",
        label: "Fitted & structured",
        sub: "Tailored to your frame",
        gradient: ["#26303a", "#c9a84c"],
        weights: { business: 2, classic: 2, minimalist: 1 },
      },
      {
        id: "q4-slim",
        emoji: "✂️",
        label: "Slim & sharp",
        sub: "Clean lines, precise cuts",
        gradient: ["#000080", "#FFFFFF"],
        weights: { preppy: 2, classic: 2, minimalist: 1 },
      },
      {
        id: "q4-mixed",
        emoji: "🎭",
        label: "Mixed proportions",
        sub: "Unexpected, experimental",
        gradient: ["#9b5de5", "#f15bb5"],
        weights: { "avant-garde": 3, edgy: 1 },
      },
    ],
  },
  {
    id: "q5",
    question: "Your pattern game?",
    hint: "What you naturally gravitate toward.",
    cards: [
      {
        id: "q5-solids",
        emoji: "⬜",
        label: "Clean solids",
        sub: "No noise, just form",
        gradient: ["#f8f6f1", "#1b1a17"],
        weights: { minimalist: 3, business: 1 },
      },
      {
        id: "q5-texture",
        emoji: "🧶",
        label: "Subtle texture & weave",
        sub: "Cable knit, tweed, linen",
        gradient: ["#D2B48C", "#8B4513"],
        weights: { classic: 2, preppy: 2, bohemian: 1 },
      },
      {
        id: "q5-graphic",
        emoji: "🖼️",
        label: "Graphics & prints",
        sub: "Logos, art, statement tees",
        gradient: ["#000000", "#FF0000"],
        weights: { streetwear: 3, "avant-garde": 1 },
      },
      {
        id: "q5-clashing",
        emoji: "🌀",
        label: "Clashing & layered",
        sub: "Rule-breaking maximalism",
        gradient: ["#9b5de5", "#fee440"],
        weights: { "avant-garde": 3, bohemian: 1 },
      },
    ],
  },
  {
    id: "q6",
    question: "What's the occasion energy?",
    hint: "Where most of your outfits live.",
    cards: [
      {
        id: "q6-street",
        emoji: "🏙️",
        label: "Street & city",
        sub: "Wherever, whenever",
        gradient: ["#1a1a1a", "#5b61e8"],
        weights: { streetwear: 2, "casual-cool": 2, edgy: 1 },
      },
      {
        id: "q6-office",
        emoji: "🏢",
        label: "Office & boardroom",
        sub: "Power dressing, polished",
        gradient: ["#26303a", "#E8DCC8"],
        weights: { business: 3, classic: 2 },
      },
      {
        id: "q6-weekend",
        emoji: "☕",
        label: "Weekend & chill",
        sub: "Relaxed but put-together",
        gradient: ["#D2B48C", "#6b8fb0"],
        weights: { "casual-cool": 3, minimalist: 1, preppy: 1 },
      },
      {
        id: "q6-event",
        emoji: "🎉",
        label: "Night out & events",
        sub: "Dressed up, turning heads",
        gradient: ["#9b5de5", "#000000"],
        weights: { "avant-garde": 2, edgy: 2, business: 1 },
      },
    ],
  },
  {
    id: "q7",
    question: "What accessories do you actually wear?",
    hint: "Your honest go-tos.",
    cards: [
      {
        id: "q7-caps-chains",
        emoji: "⛓️",
        label: "Caps, chains & rings",
        sub: "Street accessories, layered",
        gradient: ["#000000", "#C0C0C0"],
        weights: { streetwear: 3, edgy: 1 },
      },
      {
        id: "q7-watches-belts",
        emoji: "⌚",
        label: "Watches & leather belts",
        sub: "Classic, considered, clean",
        gradient: ["#8B4513", "#D4AF37"],
        weights: { classic: 2, business: 2, preppy: 1 },
      },
      {
        id: "q7-stacked",
        emoji: "💍",
        label: "Stacked & layered jewelry",
        sub: "Rings, bracelets, necklaces",
        gradient: ["#D2B48C", "#c9a84c"],
        weights: { bohemian: 3, "avant-garde": 1 },
      },
      {
        id: "q7-barely",
        emoji: "🚫",
        label: "Barely any",
        sub: "The outfit speaks for itself",
        gradient: ["#f8f6f1", "#c9c2b4"],
        weights: { minimalist: 3, "casual-cool": 1 },
      },
    ],
  },
  {
    id: "q8",
    question: "Who's your inspo energy?",
    hint: "The vibe you're channelling — doesn't have to be a specific person.",
    cards: [
      {
        id: "q8-athlete",
        emoji: "🏆",
        label: "Off-duty athlete",
        sub: "Effortless, confident, active",
        gradient: ["#000000", "#FF6B00"],
        weights: { sporty: 3, "casual-cool": 1, streetwear: 1 },
      },
      {
        id: "q8-fashion-week",
        emoji: "🎪",
        label: "Fashion week front row",
        sub: "High fashion, fearless",
        gradient: ["#9b5de5", "#f15bb5"],
        weights: { "avant-garde": 3, edgy: 1 },
      },
      {
        id: "q8-intellectual",
        emoji: "📚",
        label: "Coffee shop intellectual",
        sub: "Smart, understated, put-together",
        gradient: ["#2f5e4e", "#D2B48C"],
        weights: { classic: 2, minimalist: 2, preppy: 1 },
      },
      {
        id: "q8-festival",
        emoji: "🎵",
        label: "Music festival headliner",
        sub: "Free-spirited, layered, expressive",
        gradient: ["#808000", "#D2691E"],
        weights: { bohemian: 3, edgy: 1 },
      },
    ],
  },
  {
    id: "q9",
    question: "What fabric feels most like you?",
    hint: "Touch, texture, and quality signals.",
    cards: [
      {
        id: "q9-technical",
        emoji: "🏃",
        label: "Technical & performance",
        sub: "Moisture-wicking, stretch, utility",
        gradient: ["#000000", "#0000FF"],
        weights: { sporty: 3, streetwear: 1 },
      },
      {
        id: "q9-natural",
        emoji: "🌿",
        label: "Natural & organic",
        sub: "Cotton, linen, wool",
        gradient: ["#D2B48C", "#808000"],
        weights: { bohemian: 2, "casual-cool": 2, minimalist: 1 },
      },
      {
        id: "q9-luxury",
        emoji: "💎",
        label: "Luxury & refined",
        sub: "Cashmere, silk, fine wool",
        gradient: ["#000080", "#D4AF37"],
        weights: { classic: 2, business: 2, minimalist: 1 },
      },
      {
        id: "q9-distressed",
        emoji: "✂️",
        label: "Distressed & worn-in",
        sub: "Ripped, washed, lived-in",
        gradient: ["#1a1a1a", "#8B4513"],
        weights: { edgy: 2, streetwear: 2, "casual-cool": 1 },
      },
    ],
  },
  {
    id: "q10",
    question: "What's the vibe you bring?",
    hint: "How people would describe your energy when you walk in.",
    cards: [
      {
        id: "q10-calm",
        emoji: "🧘",
        label: "Calm & intentional",
        sub: "Quiet confidence, nothing extra",
        gradient: ["#f8f6f1", "#7c8a72"],
        weights: { minimalist: 3, classic: 1 },
      },
      {
        id: "q10-commanding",
        emoji: "⚡",
        label: "Bold & commanding",
        sub: "Power, presence, authority",
        gradient: ["#26303a", "#FF0000"],
        weights: { business: 2, edgy: 2, "avant-garde": 1 },
      },
      {
        id: "q10-effortless",
        emoji: "😎",
        label: "Effortless cool",
        sub: "Stylish without trying",
        gradient: ["#6b8fb0", "#000000"],
        weights: { "casual-cool": 2, streetwear: 2, sporty: 1 },
      },
      {
        id: "q10-experimental",
        emoji: "🌀",
        label: "Experimental & unexpected",
        sub: "Fashion as self-expression",
        gradient: ["#9b5de5", "#fee440"],
        weights: { "avant-garde": 3, bohemian: 1 },
      },
    ],
  },
];

/**
 * Takes all selected card IDs across all questions and returns the top-scoring StyleVibe.
 * Ties go to the style that appears first in STYLES order.
 */
export function scoreVibes(selectedCardIds: string[]): StyleVibe {
  const totals: Record<string, number> = {};

  for (const question of QUIZ) {
    for (const card of question.cards) {
      if (selectedCardIds.includes(card.id)) {
        for (const [style, weight] of Object.entries(card.weights)) {
          totals[style] = (totals[style] ?? 0) + (weight ?? 0);
        }
      }
    }
  }

  if (Object.keys(totals).length === 0) return "casual-cool";

  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0] as StyleVibe;
}

/** Returns the top 3 styles with scores, for the reveal screen. */
export function topThreeVibes(
  selectedCardIds: string[],
): Array<{ style: StyleVibe; score: number }> {
  const totals: Record<string, number> = {};

  for (const question of QUIZ) {
    for (const card of question.cards) {
      if (selectedCardIds.includes(card.id)) {
        for (const [style, weight] of Object.entries(card.weights)) {
          totals[style] = (totals[style] ?? 0) + (weight ?? 0);
        }
      }
    }
  }

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([style, score]) => ({ style: style as StyleVibe, score }));
}
