/** Style scoring algorithm — P3 owns this.
 *  Local stub — the real file lives in src/lib/scoring.ts on the team's repo.
 *  Score = 60% style match + 40% color harmony
 */
import type { OutfitTag, OutfitColor, StyleVibe, StyleScore } from "@/types";

const STYLE_ITEMS: Record<StyleVibe, string[]> = {
  streetwear: ["hoodie", "sneakers", "cap", "joggers", "t-shirt", "jacket", "backpack", "graphic", "cargo", "oversized"],
  minimalist: ["blazer", "trousers", "sneakers", "t-shirt", "coat", "jeans", "white", "black", "neutral", "clean"],
  classic: ["blazer", "shirt", "loafers", "trousers", "belt", "watch", "oxford", "trench", "chinos"],
  edgy: ["leather", "boots", "jacket", "black", "chains", "ripped", "denim", "studs", "moto", "harness"],
  sporty: ["sneakers", "leggings", "hoodie", "tank", "shorts", "cap", "athletic", "tracksuit", "jersey"],
  preppy: ["polo", "chinos", "loafers", "blazer", "sweater", "belt", "oxford", "vest", "plaid", "gingham"],
  bohemian: ["linen", "sandals", "scarf", "hat", "jewelry", "floral", "fringe", "flowy", "earthy", "layers"],
  business: ["suit", "blazer", "shirt", "trousers", "heels", "oxfords", "tie", "briefcase", "structured", "formal"],
  "avant-garde": ["oversized", "asymmetric", "experimental", "layered", "unconventional", "sculptural", "statement"],
  "casual-cool": ["jeans", "tee", "sneakers", "denim", "jacket", "hoodie", "relaxed", "everyday", "simple"],
};

const HARMONIOUS_PAIRS: [string, string][] = [
  ["black", "white"], ["navy", "white"], ["navy", "beige"], ["black", "red"],
  ["gray", "pink"], ["blue", "brown"], ["green", "beige"], ["white", "blue"],
  ["black", "gold"], ["cream", "brown"], ["olive", "cream"], ["burgundy", "cream"],
];

const CLASHING_PAIRS: [string, string][] = [
  ["red", "orange"], ["red", "pink"], ["green", "red"], ["purple", "orange"],
];

function normalizeColor(c: string) { return c.toLowerCase().replace(/\s+/g, ""); }

function calcStyleMatch(tags: OutfitTag[], style: StyleVibe): number {
  const styleItems = STYLE_ITEMS[style] || [];
  const clothing = tags.filter((t) => t.confidence >= 0.7);
  if (!clothing.length || !styleItems.length) return 50;
  let hits = 0;
  for (const tag of clothing) {
    const n = tag.name.toLowerCase();
    if (styleItems.some((i) => n.includes(i) || i.includes(n))) hits++;
  }
  return Math.round(Math.min(100, (hits / clothing.length) * 120));
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

export function calculateScore(tags: OutfitTag[], colors: OutfitColor[], userStyle: StyleVibe): StyleScore {
  const styleMatch = calcStyleMatch(tags, userStyle);
  const colorHarmony = calcColorHarmony(colors);
  const overall = Math.round(styleMatch * 0.6 + colorHarmony * 0.4);
  return {
    overall, styleMatch, colorHarmony,
    breakdown: [
      { label: "Style Match", score: styleMatch, explanation: styleMatch >= 75 ? `Great ${userStyle} vibes!` : styleMatch >= 50 ? `Some ${userStyle} elements, but a few pieces pull away.` : `Consider swapping key pieces to lean into ${userStyle}.` },
      { label: "Color Harmony", score: colorHarmony, explanation: colorHarmony >= 75 ? "Beautiful color coordination!" : colorHarmony >= 50 ? "Colors mostly work, but one swap could elevate the palette." : "Try anchoring with a neutral base." },
    ],
  };
}

export function fallbackRec(tags: OutfitTag[], colors: OutfitColor[], userStyle: StyleVibe) {
  const styleItems = STYLE_ITEMS[userStyle] || [];
  const recs: { type: "swap" | "add" | "remove" | "keep"; item: string; reason: string; priority: "high" | "medium" | "low" }[] = [];
  const clothing = tags.filter((t) => t.confidence >= 0.7 && t.category === "clothing");
  for (const tag of clothing) {
    const n = tag.name.toLowerCase();
    const match = styleItems.some((i) => n.includes(i) || i.includes(n));
    if (!match) {
      recs.push({ type: "swap", item: tag.name, reason: `Swap the ${tag.name} for a ${styleItems[0]} to better match your ${userStyle} style.`, priority: "medium" });
    } else {
      recs.push({ type: "keep", item: tag.name, reason: `The ${tag.name} is a great fit for ${userStyle}!`, priority: "low" });
    }
  }
  if (!tags.some((t) => t.category === "accessory")) {
    recs.push({ type: "add", item: "accessory", reason: "Adding an accessory could complete the look.", priority: "medium" });
  }
  return recs.slice(0, 5);
}
