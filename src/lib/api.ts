import type {
  OutfitAnalysis,
  RecommendationResult,
  RawAnalyzeResponse,
  RawRecommendResponse,
  StyleId,
} from "@/types";
import { mockAnalyze, mockRecommend } from "@/lib/mockApi";

/**
 * API layer. Switches between the mock data layer and the real P2/P3 endpoints
 * based on NEXT_PUBLIC_MOCK_MODE. UI code only ever imports from here, so flipping
 * to the live backend (or back to mocks during the demo) is a one-flag change.
 */

export const MOCK_MODE =
  (process.env.NEXT_PUBLIC_MOCK_MODE ?? "true").toLowerCase() !== "false";

function mapRawAnalyze(raw: RawAnalyzeResponse, style: StyleId): OutfitAnalysis {
  const a = raw.analysis;
  return {
    items: a.items ?? {},
    colors: a.colors ?? [],
    patterns: a.patterns ?? [],
    styleTags: a.style_tags ?? a.tags ?? [style],
    score: a.score
      ? {
          overall: a.score.overall_score,
          styleMatch: a.score.style_match,
          colorHarmony: a.score.color_harmony,
        }
      : { overall: 0, styleMatch: 0, colorHarmony: 0 },
    summary: a.summary,
    confidence: a.confidence,
  };
}

function mapRawRecommend(raw: RawRecommendResponse): RecommendationResult {
  return {
    recommendations: raw.recommendations,
    fallbackUsed: raw.fallback_used,
  };
}

export async function analyzeOutfit(
  style: StyleId,
  imageDataUrl?: string,
): Promise<OutfitAnalysis> {
  if (MOCK_MODE) {
    return mockAnalyze(style);
  }

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ style, image: imageDataUrl }),
  });
  if (!res.ok) {
    throw new Error(`Analyze failed (${res.status})`);
  }
  const raw = (await res.json()) as RawAnalyzeResponse;
  if (raw.status === "error") {
    throw new Error(raw.error ?? "Analyze returned an error");
  }
  return mapRawAnalyze(raw, style);
}

export async function recommend(
  style: StyleId,
  analysis: OutfitAnalysis,
): Promise<RecommendationResult> {
  if (MOCK_MODE) {
    return mockRecommend(style);
  }

  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ style, analysis }),
  });
  if (!res.ok) {
    throw new Error(`Recommend failed (${res.status})`);
  }
  const raw = (await res.json()) as RawRecommendResponse;
  return mapRawRecommend(raw);
}
