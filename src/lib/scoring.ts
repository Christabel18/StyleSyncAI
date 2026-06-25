/** Style scoring algorithm
 *  Score = 60% style match + 40% color harmony
 */

import type { OutfitTag, OutfitColor, StyleVibe, StyleScore } from "@/types";

/** Which clothing items are associated with each style vibe */
const STYLE_ITEMS: Record<StyleVibe, string[]> = {
  minimalist: ["blazer", "trousers", "sneakers", "t-shirt", "coat", "jeans", "white", "black", "neutral"],
  streetwear: ["hoodie", "sneakers", "cap", "joggers", "t-shirt", "jacket", "backpack", "graphic"],
  classic: ["blazer", "shirt", "dress", "loafers", "trousers", "belt", "watch", "heels"],
  bohemian: ["dress", "skirt", "sandals", "scarf", "hat", "jewelry", "floral", "fringe"],
  sporty: ["sneakers", "leggings", "hoodie", "tank", "shorts", "cap", "athletic", "running"],
  preppy: ["polo", "chinos", "loafers", "blazer", "sweater", "belt", "oxford", "vest"],
  edgy: ["leather", "boots", "jacket", "black", "chains", "ripped", "denim", "studs"],
  romantic: ["dress", "blouse", "skirt", "heels", "lace", "floral", "pastel", "pearl"],
};

/** Color harmony rules — colors that work well together */
const HARMONIOUS_PAIRS: [string, string][] = [
  ["black", "white"],
  ["navy", "white"],
  ["navy", "beige"],
  ["black", "red"],
  ["gray", "pink"],
  ["blue", "brown"],
  ["green", "beige"],
  ["white", "blue"],
  ["black", "gold"],
  ["cream", "brown"],
  ["olive", "cream"],
  ["burgundy", "cream"],
  ["navy", "gold"],
  ["gray", "yellow"],
  ["black", "pink"],
];

/** Clashing color combos */
const CLASHING_PAIRS: [string, string][] = [
  ["red", "orange"],
  ["red", "pink"],
  ["green", "red"],
  ["purple", "orange"],
  ["brown", "black"],
  ["blue", "green"],
];

function normalizeColor(color: string): string {
  return color.toLowerCase().replace(/\s+/g, "");
}

/** Calculate how well the outfit items match the user's preferred style (0-100) */
function calcStyleMatch(tags: OutfitTag[], style: StyleVibe): number {
  const styleItems = STYLE_ITEMS[style] || [];
  if (styleItems.length === 0 || tags.length === 0) return 50;

  const clothingTags = tags.filter((t) => t.confidence >= 0.7);
  if (clothingTags.length === 0) return 50;

  let matchCount = 0;
  for (const tag of clothingTags) {
    const tagName = tag.name.toLowerCase();
    if (styleItems.some((item) => tagName.includes(item) || item.includes(tagName))) {
      matchCount++;
    }
  }

  const matchRatio = matchCount / clothingTags.length;
  return Math.round(Math.min(100, matchRatio * 120)); // slight boost, cap at 100
}

/** Calculate color harmony score (0-100) */
function calcColorHarmony(colors: OutfitColor[]): number {
  if (colors.length <= 1) return 75; // single color is fine

  let harmonyBonus = 0;
  let clashPenalty = 0;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const c1 = normalizeColor(colors[i].name);
      const c2 = normalizeColor(colors[j].name);

      // Check harmonious pairs
      if (HARMONIOUS_PAIRS.some(([a, b]) => (c1.includes(a) && c2.includes(b)) || (c1.includes(b) && c2.includes(a)))) {
        harmonyBonus += 20;
      }

      // Check clashing pairs
      if (CLASHING_PAIRS.some(([a, b]) => (c1.includes(a) && c2.includes(b)) || (c1.includes(b) && c2.includes(a)))) {
        clashPenalty += 15;
      }
    }
  }

  // Neutral colors (black, white, gray, beige) are always safe
  const neutralCount = colors.filter((c) => {
    const name = normalizeColor(c.name);
    return ["black", "white", "gray", "grey", "beige", "cream", "navy"].some((n) => name.includes(n));
  }).length;

  const neutralBonus = neutralCount * 10;

  const base = 60;
  return Math.round(Math.min(100, Math.max(0, base + harmonyBonus + neutralBonus - clashPenalty)));
}

/** Calculate overall style score */
export function calculateScore(
  tags: OutfitTag[],
  colors: OutfitColor[],
  userStyle: StyleVibe
): StyleScore {
  const styleMatch = calcStyleMatch(tags, userStyle);
  const colorHarmony = calcColorHarmony(colors);
  const overall = Math.round(styleMatch * 0.6 + colorHarmony * 0.4);

  return {
    overall,
    styleMatch,
    colorHarmony,
    breakdown: [
      {
        label: "Style Match",
        score: styleMatch,
        explanation:
          styleMatch >= 75
            ? `Great ${userStyle} vibes! Your pieces align well with this aesthetic.`
            : styleMatch >= 50
            ? `Some ${userStyle} elements, but a few pieces pull in a different direction.`
            : `This outfit leans away from ${userStyle}. Consider swapping key pieces.`,
      },
      {
        label: "Color Harmony",
        score: colorHarmony,
        explanation:
          colorHarmony >= 75
            ? "Beautiful color coordination! These tones complement each other well."
            : colorHarmony >= 50
            ? "The colors mostly work, but one swap could elevate the palette."
            : "The color combination is a bit jarring. Try anchoring with a neutral base.",
      },
    ],
  };
}

/** Generate rule-based recommendations (fallback if AI is unavailable) */
export function fallbackRec(
  tags: OutfitTag[],
  colors: OutfitColor[],
  userStyle: StyleVibe
): { type: "swap" | "add" | "remove" | "keep"; item: string; reason: string; priority: "high" | "medium" | "low" }[] {
  const recs: { type: "swap" | "add" | "remove" | "keep"; item: string; reason: string; priority: "high" | "medium" | "low" }[] = [];
  const styleItems = STYLE_ITEMS[userStyle] || [];

  // Find items that don't match the style
  const clothingTags = tags.filter((t) => t.confidence >= 0.7 && t.category === "clothing");
  for (const tag of clothingTags) {
    const tagName = tag.name.toLowerCase();
    const isMatch = styleItems.some((item) => tagName.includes(item) || item.includes(tagName));
    if (!isMatch) {
      const suggestion = styleItems[Math.floor(Math.random() * styleItems.length)];
      recs.push({
        type: "swap",
        item: tag.name,
        reason: `Swap the ${tag.name} for a ${suggestion} to better match your ${userStyle} style.`,
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

  // Check if an accessory would help
  const hasAccessory = tags.some((t) => t.category === "accessory");
  if (!hasAccessory) {
    recs.push({
      type: "add",
      item: "accessory",
      reason: "Adding an accessory (watch, scarf, or bag) could complete the look.",
      priority: "medium",
    });
  }

  return recs.slice(0, 5); // max 5 recommendations
}
