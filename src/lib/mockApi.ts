import type {
  OutfitAnalysis,
  RecommendationResult,
  Recommendation,
  AssistantMessage,
  StyleId,
} from "@/types";
import { personaForStyle } from "@/lib/personas";
import { getStyle } from "@/lib/styles";

/**
 * Mock data layer — the demo safety net.
 *
 * The entire frontend runs on these functions when NEXT_PUBLIC_MOCK_MODE is on
 * (the default). They produce believable, style-aware analysis + recommendations
 * so the UI is fully demoable without P2/P3/P4's backend. This also doubles as the
 * "swap to fixtures" insurance described in the hackathon plan.
 */

interface StyleProfile {
  items: OutfitAnalysis["items"];
  colors: string[];
  patterns: string[];
  styleTags: string[];
  recs: Array<Pick<Recommendation, "title" | "reason">>;
}

const PROFILES: Record<StyleId, StyleProfile> = {
  streetwear: {
    items: {
      top: "White oversized t-shirt",
      bottom: "Black cargo pants",
      shoes: "White sneakers",
      accessories: [],
    },
    colors: ["white", "black"],
    patterns: ["solid"],
    styleTags: ["casual", "streetwear"],
    recs: [
      { title: "Add a silver chain", reason: "Metal accents add edge and break up a tonal fit." },
      { title: "Layer an oversized flannel", reason: "Layering builds the relaxed, stacked streetwear silhouette." },
      { title: "Try chunkier sneakers", reason: "A heavier shoe grounds the look and strengthens the proportions." },
    ],
  },
  minimalist: {
    items: {
      top: "Cream knit sweater",
      bottom: "Tailored trousers",
      shoes: "Leather loafers",
      accessories: [],
    },
    colors: ["cream", "beige", "white"],
    patterns: ["solid"],
    styleTags: ["minimalist", "refined"],
    recs: [
      { title: "Keep one tonal palette", reason: "Staying within a single tone reads intentional and elevated." },
      { title: "Add a structured tote", reason: "A clean-lined bag adds function without disrupting the calm." },
      { title: "Swap to a fine gold stud", reason: "A single delicate accent finishes a minimalist look quietly." },
    ],
  },
  "old-money": {
    items: {
      top: "Navy cable-knit sweater",
      bottom: "Pleated chinos",
      shoes: "Suede loafers",
      accessories: ["Leather watch"],
    },
    colors: ["navy", "beige", "brown"],
    patterns: ["cable knit", "solid"],
    styleTags: ["old money", "preppy", "classic"],
    recs: [
      { title: "Drape a knit over the shoulders", reason: "The shoulder-drape is a signature heritage detail." },
      { title: "Add a gold signet or watch", reason: "Understated gold reinforces quiet, classic luxury." },
      { title: "Choose a leather belt to match shoes", reason: "Matched leathers are the mark of a considered, tailored look." },
    ],
  },
  "business-casual": {
    items: {
      top: "Light blue oxford shirt",
      bottom: "Charcoal trousers",
      shoes: "Leather derbies",
      accessories: [],
    },
    colors: ["blue", "charcoal", "white"],
    patterns: ["solid"],
    styleTags: ["business casual", "smart"],
    recs: [
      { title: "Add an unstructured blazer", reason: "A soft blazer instantly sharpens a smart-casual base." },
      { title: "Match belt to shoe leather", reason: "Coordinated leathers keep the outfit looking polished." },
      { title: "Keep a minimal watch", reason: "A slim watch adds professionalism without shouting." },
    ],
  },
  y2k: {
    items: {
      top: "Baby tee",
      bottom: "Low-rise denim",
      shoes: "Platform sneakers",
      accessories: ["Tinted sunglasses"],
    },
    colors: ["pink", "blue", "silver"],
    patterns: ["graphic"],
    styleTags: ["y2k", "playful"],
    recs: [
      { title: "Carry a baguette bag", reason: "The mini shoulder bag is peak early-2000s styling." },
      { title: "Add layered beaded jewelry", reason: "Stacked colorful pieces lean into the nostalgic energy." },
      { title: "Try a metallic accent", reason: "A hit of silver or chrome nails the futuristic Y2K mood." },
    ],
  },
  "clean-girl": {
    items: {
      top: "Fitted white tank",
      bottom: "High-waist tailored pants",
      shoes: "Minimal sandals",
      accessories: ["Gold hoops"],
    },
    colors: ["white", "beige", "gold"],
    patterns: ["solid"],
    styleTags: ["clean girl", "polished"],
    recs: [
      { title: "Add gold hoops", reason: "Warm gold is the defining clean-girl accent." },
      { title: "Layer a neutral trench", reason: "A camel trench adds polish while staying effortless." },
      { title: "Keep a slicked silhouette", reason: "A sleek hairline keeps the whole look crisp and fresh." },
    ],
  },
  casual: {
    items: {
      top: "Grey crewneck",
      bottom: "Blue straight-leg jeans",
      shoes: "White sneakers",
      accessories: [],
    },
    colors: ["grey", "blue", "white"],
    patterns: ["solid"],
    styleTags: ["casual", "everyday"],
    recs: [
      { title: "Throw on a denim jacket", reason: "A denim layer adds shape to an easy everyday base." },
      { title: "Add a crossbody bag", reason: "A small bag makes the look feel finished and practical." },
      { title: "Cuff the hems", reason: "A clean cuff sharpens relaxed denim instantly." },
    ],
  },
};

function scoreFor(style: StyleId): OutfitAnalysis["score"] {
  // Deterministic-ish believable scores per style.
  const base: Record<StyleId, OutfitAnalysis["score"]> = {
    streetwear: { overall: 82, styleMatch: 90, colorHarmony: 75 },
    minimalist: { overall: 88, styleMatch: 92, colorHarmony: 86 },
    "old-money": { overall: 86, styleMatch: 89, colorHarmony: 84 },
    "business-casual": { overall: 80, styleMatch: 85, colorHarmony: 78 },
    y2k: { overall: 76, styleMatch: 88, colorHarmony: 68 },
    "clean-girl": { overall: 90, styleMatch: 91, colorHarmony: 89 },
    casual: { overall: 78, styleMatch: 83, colorHarmony: 76 },
  };
  return base[style];
}

function delay<T>(value: T, ms = 1100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function mockAnalyze(style: StyleId): Promise<OutfitAnalysis> {
  const p = PROFILES[style];
  const styleName = getStyle(style).name;
  const analysis: OutfitAnalysis = {
    items: p.items,
    colors: p.colors,
    patterns: p.patterns,
    styleTags: p.styleTags,
    score: scoreFor(style),
    summary: `This outfit reads strongly as ${styleName.toLowerCase()}. The pieces work together with a clear ${p.styleTags[0]} foundation, and a couple of small additions would push it further.`,
    confidence: 0.88,
  };
  return delay(analysis);
}

export function mockRecommend(
  style: StyleId,
): Promise<RecommendationResult> {
  const p = PROFILES[style];
  const recommendations: Recommendation[] = p.recs.map((r, i) => ({
    id: `rec-${style}-${i + 1}`,
    title: r.title,
    reason: r.reason,
    confidence: 0.9 - i * 0.08,
    source: "rule",
  }));
  return delay({ recommendations, fallbackUsed: false }, 700);
}

export function buildAssistantMessage(
  style: StyleId,
  recs: RecommendationResult,
): AssistantMessage {
  const persona = personaForStyle(style);
  const styleName = getStyle(style).name;
  return {
    persona,
    greeting: persona.greeting,
    body: `This outfit already aligns well with your ${styleName.toLowerCase()} preferences. To elevate the fit, here's what I'd reach for:`,
    tips: recs.recommendations.map((r) => r.title),
  };
}
