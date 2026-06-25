/** Shared types for StyleSync AI */

// ─── Style Preferences ───

export type StyleVibe =
  | "minimalist"
  | "streetwear"
  | "classic"
  | "bohemian"
  | "sporty"
  | "preppy"
  | "edgy"
  | "romantic";

export type AssistantName = "Nova" | "Ava" | "Ivy";

// ─── Vision Analysis (P2 → P3 contract) ───

export interface OutfitTag {
  name: string;
  confidence: number;
  category: "clothing" | "accessory" | "footwear" | "other";
}

export interface OutfitColor {
  name: string;
  hex: string;
  dominance: number; // 0-1, how dominant this color is
}

export interface AnalyzeResponse {
  tags: OutfitTag[];
  colors: OutfitColor[];
  dominantColor: string;
  rawTags: string[]; // all Azure Vision tags for debugging
}

// ─── Recommendations (P3 output) ───

export interface StyleScore {
  overall: number; // 0-100
  styleMatch: number; // 0-100 (60% weight)
  colorHarmony: number; // 0-100 (40% weight)
  breakdown: {
    label: string;
    score: number;
    explanation: string;
  }[];
}

export interface Recommendation {
  type: "swap" | "add" | "remove" | "keep";
  item: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

export interface AssistantMessage {
  assistant: AssistantName;
  message: string;
  tone: string; // e.g., "encouraging", "bold", "analytical"
}

export interface RecommendResponse {
  score: StyleScore;
  recommendations: Recommendation[];
  assistantMessage: AssistantMessage;
}

// ─── Request types ───

export interface RecommendRequest {
  tags: OutfitTag[];
  colors: OutfitColor[];
  dominantColor: string;
  userStyle: StyleVibe;
  assistant: AssistantName;
}

// ─── Database models (P4) ───

export interface UserProfile {
  id: string;
  style_vibe: StyleVibe;
  assistant: AssistantName;
  created_at: string;
}

export interface OutfitRecord {
  id: string;
  user_id: string;
  image_url?: string;
  tags: OutfitTag[];
  colors: OutfitColor[];
  score: number;
  recommendations: Recommendation[];
  assistant_message: string;
  created_at: string;
}

export interface StyleMemory {
  user_id: string;
  total_outfits: number;
  avg_score: number;
  top_colors: string[];
  top_items: string[];
  style_trend: "improving" | "consistent" | "exploring";
  updated_at: string;
}
