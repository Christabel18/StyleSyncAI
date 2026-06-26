/**
 * API layer — switches between mock data and live endpoints via NEXT_PUBLIC_MOCK_MODE.
 * UI code only imports from here, so flipping to the real backend is a one-flag change.
 */
import type {
  StyleVibe,
  AssistantName,
  AnalyzeResponse,
  RecommendResponse,
} from "@/types";
import { mockAnalyze, mockRecommend } from "@/lib/mockSession";

export const MOCK_MODE =
  (process.env.NEXT_PUBLIC_MOCK_MODE ?? "true").toLowerCase() !== "false";

export async function analyzeOutfit(
  style: StyleVibe,
  imageBase64?: string,
): Promise<AnalyzeResponse> {
  if (MOCK_MODE) return mockAnalyze(style);

  if (!imageBase64) throw new Error("No image provided");

  // Convert base64 data URL → Blob → FormData (route expects multipart/form-data)
  const res64 = await fetch(imageBase64);
  const blob = await res64.blob();
  const formData = new FormData();
  formData.append("image", blob, "outfit.jpg");

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });
  if (res.status === 422) {
    const data = await res.json();
    throw new Error(data.error ?? "No clothing detected. Try a clearer photo.");
  }
  if (!res.ok) throw new Error(`Analyze failed (${res.status})`);
  return res.json() as Promise<AnalyzeResponse>;
}

export async function getRecommendations(
  analysis: AnalyzeResponse,
  style: StyleVibe,
  assistant: AssistantName,
): Promise<RecommendResponse> {
  if (MOCK_MODE) return mockRecommend(analysis, style, assistant);

  const body = {
    tags: analysis.tags,
    colors: analysis.colors,
    dominantColor: analysis.dominantColor,
    userStyle: style,
    assistant,
    styleSignals: analysis.styleSignals ?? [],
  };
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Recommend failed (${res.status})`);
  return res.json() as Promise<RecommendResponse>;
}
