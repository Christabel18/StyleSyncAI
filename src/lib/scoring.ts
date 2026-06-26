/** Style scoring algorithm — P3 owns this.
 *  Local stub — the real file lives in src/lib/scoring.ts on the team's repo.
 *  Score = 60% style match + 40% color harmony
 */
import type { OutfitTag, OutfitColor, StyleVibe, StyleScore } from "@/types";

const STYLE_ITEMS: Record<StyleVibe, string[]> = {
  streetwear: [
    "hoodie", "sneakers", "cap", "joggers", "t-shirt", "jacket", "backpack",
    "graphic", "cargo", "oversized", "tracksuit", "sweatshirt", "air force",
  ],
  minimalist: [
    // Tops — Azure often returns these for simple fitted tops
    "blazer", "t-shirt", "tee", "top", "blouse", "shirt", "knit", "fitted",
    "long sleeve", "bodysuit", "tank",
    // Bottoms
    "trousers", "jeans", "slacks", "chinos", "straight leg",
    // Outerwear
    "coat", "trench", "overcoat",
    // Footwear
    "sneakers", "loafers", "flats", "mules",
    // Colours — neutrals ARE the minimalist signature; bonus if matched
    "white", "black", "grey", "gray", "cream", "beige", "neutral", "clean",
    // Azure misclassification terms that map to minimalist
    "casual dress", "dress", "shift",
  ],
  classic: [
    "blazer", "shirt", "blouse", "oxford", "loafers", "trousers", "belt",
    "watch", "trench", "chinos", "polo", "coat", "heels", "oxfords",
  ],
  edgy: [
    "leather", "boots", "jacket", "black", "chains", "ripped", "denim",
    "studs", "moto", "harness", "combat", "cargo",
  ],
  sporty: [
    "sneakers", "leggings", "hoodie", "tank", "shorts", "cap", "athletic",
    "tracksuit", "jersey", "joggers", "sweatshirt", "trainers",
  ],
  preppy: [
    "polo", "chinos", "loafers", "blazer", "sweater", "belt", "oxford",
    "vest", "plaid", "gingham", "shirt", "cardigan", "knit",
  ],
  bohemian: [
    "linen", "sandals", "scarf", "hat", "jewelry", "floral", "fringe",
    "flowy", "earthy", "layers", "blouse", "dress", "midi", "maxi",
  ],
  business: [
    "suit", "blazer", "shirt", "trousers", "heels", "oxfords", "tie",
    "briefcase", "structured", "formal", "blouse", "pencil skirt",
  ],
  "avant-garde": [
    "oversized", "asymmetric", "experimental", "layered", "unconventional",
    "sculptural", "statement", "coat", "platform",
  ],
  "casual-cool": [
    "jeans", "tee", "t-shirt", "sneakers", "denim", "jacket", "hoodie",
    "relaxed", "everyday", "top", "blouse", "chinos",
  ],
};

/**
 * Neutral colour names — having ALL neutrals is a strong minimalist signal.
 * We use this for a bonus in style match for minimalist/classic/business.
 */
const NEUTRAL_COLOURS = new Set([
  "white", "black", "grey", "gray", "beige", "cream", "ivory", "charcoal",
  "navy", "off-white", "ecru", "stone", "sand",
]);

const NEUTRAL_BONUS_STYLES = new Set<StyleVibe>(["minimalist", "classic", "business"]);

const HARMONIOUS_PAIRS: [string, string][] = [
  ["black", "white"], ["navy", "white"], ["navy", "beige"], ["black", "red"],
  ["gray", "pink"], ["blue", "brown"], ["green", "beige"], ["white", "blue"],
  ["black", "gold"], ["cream", "brown"], ["olive", "cream"], ["burgundy", "cream"],
  ["white", "grey"], ["white", "gray"], ["black", "grey"], ["black", "gray"],
  ["beige", "white"], ["navy", "grey"],
];

const CLASHING_PAIRS: [string, string][] = [
  ["red", "orange"], ["red", "pink"], ["green", "red"], ["purple", "orange"],
];

function normalizeColor(c: string) { return c.toLowerCase().replace(/\s+/g, ""); }

function calcStyleMatch(tags: OutfitTag[], colors: OutfitColor[], style: StyleVibe): number {
  const styleItems = STYLE_ITEMS[style] || [];
  const clothing = tags.filter((t) => t.confidence >= 0.6); // lowered from 0.7 for better recall
  if (!clothing.length || !styleItems.length) return 50;

  let hits = 0;
  for (const tag of clothing) {
    const n = tag.name.toLowerCase();
    if (styleItems.some((i) => n.includes(i) || i.includes(n))) hits++;
  }

  let matchScore = Math.round(Math.min(100, (hits / clothing.length) * 120));

  // Colour bonus: if style rewards neutrals and ALL detected colours are neutral,
  // give a significant boost (e.g. white top + grey jeans = very minimalist)
  if (NEUTRAL_BONUS_STYLES.has(style) && colors.length > 0) {
    const allNeutral = colors.every((c) => NEUTRAL_COLOURS.has(normalizeColor(c.name)));
    const neutralCount = colors.filter((c) => NEUTRAL_COLOURS.has(normalizeColor(c.name))).length;
    if (allNeutral) matchScore = Math.min(100, matchScore + 20);
    else if (neutralCount >= 2) matchScore = Math.min(100, matchScore + 10);
  }

  return matchScore;
}

function calcColorHarmony(colors: OutfitColor[]): number {
  if (colors.length <= 1) return 75;
  let bonus = 0, penalty = 0;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const c1 = normalizeColor(colors[i].name);
      const c2 = normalizeColor(colors[j].name);
      if (HARMONIOUS_PAIRS.some(([a, b]) => (c1.includes(a) && c2.includes(b)) || (c1.includes(b) && c2.includes(a)))) bonus += 20;
      if (CLASHING_PAIRS.some(([a, b]) => (c1.includes(a) && c2.includes(b)) || (c1.includes(b) && c2.includes(a)))) penalty += 15;
    }
  }
  const neutrals = colors.filter((c) => ["black","white","gray","grey","beige","cream","navy"].some((n) => normalizeColor(c.name).includes(n))).length;
  return Math.round(Math.min(100, Math.max(0, 60 + bonus + neutrals * 10 - penalty)));
}

export function calculateScore(tags: OutfitTag[], colors: OutfitColor[], userStyle: StyleVibe, styleSignals?: string[]): StyleScore {
  let styleMatch = calcStyleMatch(tags, colors, userStyle);

  // ── FIX 2: Style signal bonus ──────────────────────────────────────────────
  // Azure returns "street fashion" at 98% for streetwear outfits — use it.
  // If the Azure-detected style signal matches the user's chosen style, +15 pts.
  if (styleSignals && styleSignals.length > 0) {
    if (styleSignals.includes(userStyle)) {
      styleMatch = Math.min(100, styleMatch + 15);
    }
    // Partial match: signal is related style (e.g. "street fashion" → "edgy" also gets a small boost)
    const RELATED: Partial<Record<StyleVibe, string[]>> = {
      edgy: ["streetwear"],
      "casual-cool": ["streetwear"],
      sporty: ["streetwear"],
      preppy: ["classic", "business"],
    };
    const related = RELATED[userStyle] ?? [];
    if (related.some(r => styleSignals.includes(r))) {
      styleMatch = Math.min(100, styleMatch + 8);
    }
  }

  const colorHarmony = calcColorHarmony(colors);
  const overall = Math.round(styleMatch * 0.6 + colorHarmony * 0.4);
  return {
    overall, styleMatch, colorHarmony,
    breakdown: [
      {
        label: "Style Match",
        score: styleMatch,
        explanation:
          styleMatch >= 80 ? `Nailing the ${userStyle} aesthetic — strong piece choices.`
          : styleMatch >= 60 ? `Good ${userStyle} foundation. A couple of tweaks would sharpen it.`
          : `Some ${userStyle} elements, but a few pieces pull in a different direction.`,
      },
      {
        label: "Color Harmony",
        score: colorHarmony,
        explanation:
          colorHarmony >= 75 ? "Beautiful color coordination!"
          : colorHarmony >= 50 ? "Colors mostly work, but one swap could elevate the palette."
          : "Try anchoring with a neutral base.",
      },
    ],
  };
}

/** Better recommendation reason strings — no "swap X for a X" nonsense. */
const SWAP_SUGGESTIONS: Partial<Record<StyleVibe, string>> = {
  minimalist: "a clean, simple piece in a neutral tone",
  streetwear: "an oversized or graphic streetwear piece",
  classic: "a tailored classic piece like a blazer or oxford shirt",
  edgy: "something with leather, hardware, or dark tones",
  sporty: "an athletic or performance piece",
  preppy: "a polo, knit, or heritage pattern piece",
  bohemian: "a flowy, earthy, or textured piece",
  business: "a sharp, structured business piece",
  "avant-garde": "something unexpected or avant-garde in cut",
  "casual-cool": "a relaxed, effortless everyday staple",
};

export function fallbackRec(tags: OutfitTag[], colors: OutfitColor[], userStyle: StyleVibe) {
  const styleItems = STYLE_ITEMS[userStyle] || [];
  const recs: { type: "swap" | "add" | "remove" | "keep"; item: string; reason: string; priority: "high" | "medium" | "low" }[] = [];
  const clothing = tags.filter((t) => t.confidence >= 0.6 && t.category === "clothing");
  const suggestion = SWAP_SUGGESTIONS[userStyle] ?? styleItems[0];

  for (const tag of clothing) {
    const n = tag.name.toLowerCase();
    const match = styleItems.some((i) => n.includes(i) || i.includes(n));
    if (!match) {
      recs.push({
        type: "swap",
        item: tag.name,
        reason: `Consider swapping the ${tag.name} for ${suggestion} to better match your ${userStyle} aesthetic.`,
        priority: "medium",
      });
    } else {
      recs.push({
        type: "keep",
        item: tag.name,
        reason: `The ${tag.name} is a great fit for ${userStyle}!`,
        priority: "low",
      });
    }
  }

  if (!tags.some((t) => t.category === "accessory")) {
    recs.push({
      type: "add",
      item: "accessory",
      reason: "A minimal accessory (watch, simple jewelry, or bag) could complete the look.",
      priority: "medium",
    });
  }
  return recs.slice(0, 5);
}
