/**
 * Shared types for StyleSync AI frontend.
 *
 * The frontend's canonical shapes are `OutfitAnalysis` and `RecommendationResult`.
 * The api layer (src/lib/api.ts) maps the raw backend responses from P2 (/api/analyze)
 * and P3 (/api/recommend) into these shapes, so UI code never depends on the wire format.
 */

/* ---------------------------------- Styles --------------------------------- */

export type StyleId =
  | "streetwear"
  | "minimalist"
  | "old-money"
  | "business-casual"
  | "y2k"
  | "clean-girl"
  | "casual";

export interface StyleOption {
  id: StyleId;
  name: string;
  tagline: string;
  description: string;
  swatch: string[]; // representative hex colors
  persona: PersonaId;
}

/* --------------------------------- Personas -------------------------------- */

export type PersonaId = "nova" | "ava" | "ivy";

export interface Persona {
  id: PersonaId;
  name: string;
  emoji: string;
  title: string; // e.g. "Streetwear stylist"
  blurb: string; // one-line personality description
  accentVar: string; // css custom property, e.g. "var(--color-nova)"
  greeting: string;
}

/* --------------------------------- Analysis -------------------------------- */

export interface DetectedItems {
  top?: string;
  bottom?: string;
  shoes?: string;
  outerwear?: string;
  accessories?: string[];
}

export interface OutfitScore {
  overall: number; // 0–100
  styleMatch: number; // 0–100
  colorHarmony: number; // 0–100
}

export interface OutfitAnalysis {
  items: DetectedItems;
  colors: string[]; // color names, e.g. ["white", "black"]
  patterns: string[]; // e.g. ["solid"]
  styleTags: string[]; // e.g. ["casual", "streetwear"]
  score: OutfitScore;
  summary: string; // one-paragraph summary (from P2)
  confidence: number; // 0–1 (from P2)
}

/* ------------------------------ Recommendations ---------------------------- */

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  confidence: number; // 0–1
  source: "ai" | "rule";
}

export interface RecommendationResult {
  recommendations: Recommendation[];
  fallbackUsed: boolean;
}

/* ------------------------------ Assistant message -------------------------- */

export interface AssistantMessage {
  persona: Persona;
  greeting: string;
  body: string;
  tips: string[];
}

/* --------------------------------- Session --------------------------------- */

export interface StyleSession {
  id: string;
  imageDataUrl?: string;
  preferredStyle: StyleId;
  analysis: OutfitAnalysis;
  recommendations: RecommendationResult;
  assistant: AssistantMessage;
  createdAt: string; // ISO
}

export interface StyleMemory {
  preferredStyle?: StyleId;
  favoriteColors: string[];
  commonItems: string[];
  sessions: StyleSession[];
}

/* ------------------------- Raw backend wire formats ------------------------ */
/** P2 — GET/POST /api/analyze response (schema agreed in Phase 1). */
export interface RawAnalyzeResponse {
  status: "success" | "error";
  analysis: {
    summary: string;
    insights: string[];
    confidence: number;
    tags: string[];
    // fashion-domain extensions P2 layers on top of the base schema:
    items?: DetectedItems;
    colors?: string[];
    patterns?: string[];
    style_tags?: string[];
    score?: {
      overall_score: number;
      style_match: number;
      color_harmony: number;
    };
  };
  model: string;
  timestamp: string;
  error?: string;
}

/** P3 — POST /api/recommend response. */
export interface RawRecommendResponse {
  recommendations: Array<{
    id: string;
    title: string;
    reason: string;
    confidence: number;
    source: "ai" | "rule";
  }>;
  fallback_used: boolean;
}
