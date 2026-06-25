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
      { name: "joggers", confidence: 0.91, category: "clothing" },
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
      { name: "chinos", confidence: 0.90, category: "clothing" },
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
  bohemian: {
    tags: [
      { name: "dress", confidence: 0.90, category: "clothing" },
      { name: "sandals", confidence: 0.85, category: "footwear" },
      { name: "scarf", confidence: 0.80, category: "accessory" },
      { name: "hat", confidence: 0.75, category: "accessory" },
      { name: "jewelry", confidence: 0.82, category: "accessory" },
    ],
    colors: [
      { name: "brown", hex: "#8B4513", dominance: 0.35 },
      { name: "cream", hex: "#FFFDD0", dominance: 0.4 },
      { name: "olive", hex: "#808000", dominance: 0.25 },
    ],
    dominantColor: "cream",
  },
  sporty: {
    tags: [
      { name: "sneakers", confidence: 0.95, category: "footwear" },
      { name: "leggings", confidence: 0.88, category: "clothing" },
      { name: "hoodie", confidence: 0.85, category: "clothing" },
      { name: "tank", confidence: 0.82, category: "clothing" },
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
  edgy: {
    tags: [
      { name: "leather jacket", confidence: 0.92, category: "clothing" },
      { name: "boots", confidence: 0.90, category: "footwear" },
      { name: "black jeans", confidence: 0.88, category: "clothing" },
      { name: "chains", confidence: 0.80, category: "accessory" },
    ],
    colors: [
      { name: "black", hex: "#000000", dominance: 0.7 },
      { name: "red", hex: "#FF0000", dominance: 0.2 },
      { name: "silver", hex: "#C0C0C0", dominance: 0.1 },
    ],
    dominantColor: "black",
  },
  romantic: {
    tags: [
      { name: "dress", confidence: 0.92, category: "clothing" },
      { name: "heels", confidence: 0.88, category: "footwear" },
      { name: "lace", confidence: 0.82, category: "clothing" },
      { name: "pearl", confidence: 0.78, category: "accessory" },
    ],
    colors: [
      { name: "pink", hex: "#FFC0CB", dominance: 0.45 },
      { name: "white", hex: "#FFFFFF", dominance: 0.35 },
      { name: "cream", hex: "#FFFDD0", dominance: 0.2 },
    ],
    dominantColor: "pink",
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
