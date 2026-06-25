/**
 * Mock session builder — uses the SAME scoring and prompt logic as the real backend.
 * This is the demo safety net: reliable, style-aware, no API needed.
 * P2/P3: to go live, set NEXT_PUBLIC_MOCK_MODE=false.
 */
import type {
  OutfitTag,
  OutfitColor,
  StyleVibe,
  AssistantName,
  AnalyzeResponse,
  RecommendResponse,
} from "@/types";
import { calculateScore, fallbackRec } from "@/lib/scoring";
import { getFallbackMessage } from "@/lib/prompts";

/** Pre-built fixture tags + colors per style (mirror the /fixtures/*.json data) */
const FIXTURES: Record<
  StyleVibe,
  { tags: OutfitTag[]; colors: OutfitColor[]; dominantColor: string }
> = {
  streetwear: {
    tags: [
      { name: "hoodie", confidence: 0.94, category: "clothing" },
      { name: "cargo pants", confidence: 0.91, category: "clothing" },
      { name: "sneakers", confidence: 0.93, category: "footwear" },
      { name: "cap", confidence: 0.85, category: "accessory" },
      { name: "backpack", confidence: 0.78, category: "accessory" },
    ],
    colors: [
      { name: "black", hex: "#000000", dominance: 0.5 },
      { name: "white", hex: "#FFFFFF", dominance: 0.3 },
      { name: "red", hex: "#FF0000", dominance: 0.2 },
    ],
    dominantColor: "black",
  },
  minimalist: {
    tags: [
      { name: "blazer", confidence: 0.88, category: "clothing" },
      { name: "t-shirt", confidence: 0.92, category: "clothing" },
      { name: "trousers", confidence: 0.87, category: "clothing" },
      { name: "sneakers", confidence: 0.90, category: "footwear" },
    ],
    colors: [
      { name: "white", hex: "#FFFFFF", dominance: 0.5 },
      { name: "black", hex: "#000000", dominance: 0.3 },
      { name: "gray", hex: "#808080", dominance: 0.2 },
    ],
    dominantColor: "white",
  },
  classic: {
    tags: [
      { name: "blazer", confidence: 0.95, category: "clothing" },
      { name: "oxford shirt", confidence: 0.90, category: "clothing" },
      { name: "trousers", confidence: 0.88, category: "clothing" },
      { name: "loafers", confidence: 0.88, category: "footwear" },
      { name: "watch", confidence: 0.82, category: "accessory" },
      { name: "belt", confidence: 0.80, category: "accessory" },
    ],
    colors: [
      { name: "navy", hex: "#000080", dominance: 0.4 },
      { name: "beige", hex: "#F5F5DC", dominance: 0.35 },
      { name: "brown", hex: "#8B4513", dominance: 0.25 },
    ],
    dominantColor: "navy",
  },
  edgy: {
    tags: [
      { name: "leather jacket", confidence: 0.92, category: "clothing" },
      { name: "boots", confidence: 0.90, category: "footwear" },
      { name: "black jeans", confidence: 0.88, category: "clothing" },
      { name: "chains", confidence: 0.80, category: "accessory" },
      { name: "studded belt", confidence: 0.75, category: "accessory" },
    ],
    colors: [
      { name: "black", hex: "#000000", dominance: 0.7 },
      { name: "red", hex: "#FF0000", dominance: 0.2 },
      { name: "silver", hex: "#C0C0C0", dominance: 0.1 },
    ],
    dominantColor: "black",
  },
  sporty: {
    tags: [
      { name: "sneakers", confidence: 0.95, category: "footwear" },
      { name: "tracksuit", confidence: 0.88, category: "clothing" },
      { name: "jersey", confidence: 0.85, category: "clothing" },
      { name: "cap", confidence: 0.78, category: "accessory" },
    ],
    colors: [
      { name: "black", hex: "#000000", dominance: 0.45 },
      { name: "white", hex: "#FFFFFF", dominance: 0.35 },
      { name: "blue", hex: "#0000FF", dominance: 0.2 },
    ],
    dominantColor: "black",
  },
  preppy: {
    tags: [
      { name: "polo", confidence: 0.90, category: "clothing" },
      { name: "chinos", confidence: 0.88, category: "clothing" },
      { name: "loafers", confidence: 0.85, category: "footwear" },
      { name: "blazer", confidence: 0.80, category: "clothing" },
      { name: "belt", confidence: 0.75, category: "accessory" },
    ],
    colors: [
      { name: "navy", hex: "#000080", dominance: 0.4 },
      { name: "white", hex: "#FFFFFF", dominance: 0.35 },
      { name: "green", hex: "#008000", dominance: 0.25 },
    ],
    dominantColor: "navy",
  },
  bohemian: {
    tags: [
      { name: "linen shirt", confidence: 0.90, category: "clothing" },
      { name: "sandals", confidence: 0.85, category: "footwear" },
      { name: "scarf", confidence: 0.80, category: "accessory" },
      { name: "wide-brim hat", confidence: 0.75, category: "accessory" },
      { name: "layered jewelry", confidence: 0.82, category: "accessory" },
    ],
    colors: [
      { name: "brown", hex: "#8B4513", dominance: 0.35 },
      { name: "cream", hex: "#FFFDD0", dominance: 0.4 },
      { name: "olive", hex: "#808000", dominance: 0.25 },
    ],
    dominantColor: "cream",
  },
  business: {
    tags: [
      { name: "suit", confidence: 0.95, category: "clothing" },
      { name: "dress shirt", confidence: 0.92, category: "clothing" },
      { name: "oxfords", confidence: 0.88, category: "footwear" },
      { name: "tie", confidence: 0.85, category: "accessory" },
      { name: "briefcase", confidence: 0.78, category: "accessory" },
    ],
    colors: [
      { name: "charcoal", hex: "#36454F", dominance: 0.5 },
      { name: "white", hex: "#FFFFFF", dominance: 0.35 },
      { name: "navy", hex: "#000080", dominance: 0.15 },
    ],
    dominantColor: "charcoal",
  },
  "avant-garde": {
    tags: [
      { name: "oversized coat", confidence: 0.91, category: "clothing" },
      { name: "platform boots", confidence: 0.88, category: "footwear" },
      { name: "asymmetric top", confidence: 0.85, category: "clothing" },
      { name: "statement bag", confidence: 0.80, category: "accessory" },
    ],
    colors: [
      { name: "black", hex: "#000000", dominance: 0.4 },
      { name: "white", hex: "#FFFFFF", dominance: 0.3 },
      { name: "purple", hex: "#9b5de5", dominance: 0.3 },
    ],
    dominantColor: "black",
  },
  "casual-cool": {
    tags: [
      { name: "jeans", confidence: 0.93, category: "clothing" },
      { name: "t-shirt", confidence: 0.95, category: "clothing" },
      { name: "sneakers", confidence: 0.92, category: "footwear" },
      { name: "denim jacket", confidence: 0.85, category: "clothing" },
    ],
    colors: [
      { name: "blue", hex: "#6b8fb0", dominance: 0.4 },
      { name: "white", hex: "#FFFFFF", dominance: 0.35 },
      { name: "gray", hex: "#808080", dominance: 0.25 },
    ],
    dominantColor: "blue",
  },
};

function delay<T>(val: T, ms = 1200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(val), ms));
}

export function getMockAnalysis(style: StyleVibe): AnalyzeResponse {
  const f = FIXTURES[style];
  return {
    tags: f.tags,
    colors: f.colors,
    dominantColor: f.dominantColor,
    rawTags: f.tags.map((t) => t.name),
  };
}

export async function mockAnalyze(style: StyleVibe): Promise<AnalyzeResponse> {
  return delay(getMockAnalysis(style));
}

export async function mockRecommend(
  analysis: AnalyzeResponse,
  style: StyleVibe,
  assistant: AssistantName,
): Promise<RecommendResponse> {
  const score = calculateScore(analysis.tags, analysis.colors, style);
  const recommendations = fallbackRec(analysis.tags, analysis.colors, style);
  const message = getFallbackMessage(assistant, score.overall, style);
  return delay(
    {
      score,
      recommendations,
      assistantMessage: {
        assistant,
        message,
        tone:
          assistant === "Nova"
            ? "encouraging"
            : assistant === "Ava"
              ? "bold"
              : "analytical",
      },
    },
    700,
  );
}
