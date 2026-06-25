/** P2 — Azure AI Vision integration.
 *
 *  Uses Computer Vision REST 3.2 (visualFeatures=Color,Tags,Objects,Description)
 *  because the v4 Image Analysis API removed the color extraction feature, and we
 *  need named dominant colors + an accent HEX in a single round-trip.
 *
 *  Exports:
 *    - analyzeImage(buffer): real Azure call + parsing, throws VisionError on failure
 *    - parseAzureResponse(raw): pure mapping (tested independently)
 *    - FALLBACK_RESPONSE: hardcoded demo-safe AnalyzeResponse
 *    - VisionError: typed error with .code for the route to branch on
 */

import type { AnalyzeResponse, OutfitTag, OutfitColor } from "@/types";
import { colorNameToHex, normalizeHex } from "./colorMap";
import { classifyTag } from "./taxonomy";

const CONFIDENCE_THRESHOLD = 0.7;
const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 500;

export type VisionErrorCode =
  | "no_clothing"
  | "low_quality"
  | "azure_error"
  | "config_missing"
  | "timeout";

export class VisionError extends Error {
  constructor(
    message: string,
    public readonly code: VisionErrorCode,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "VisionError";
  }
}

interface AzureVisionRaw {
  tags?: { name: string; confidence: number }[];
  objects?: { object: string; confidence: number }[];
  description?: { tags?: string[]; captions?: { text: string; confidence: number }[] };
  color?: {
    dominantColors?: string[];
    dominantColorForeground?: string;
    dominantColorBackground?: string;
    accentColor?: string;
    isBwImg?: boolean;
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

async function callAzureVision(image: ArrayBuffer): Promise<AzureVisionRaw> {
  const endpoint = process.env.AZURE_VISION_ENDPOINT;
  const key = process.env.AZURE_VISION_KEY;

  if (
    !endpoint ||
    !key ||
    endpoint.includes("your-resource") ||
    key.includes("your-key")
  ) {
    throw new VisionError(
      "Azure Vision credentials not configured",
      "config_missing",
    );
  }

  const url =
    `${endpoint.replace(/\/$/, "")}/vision/v3.2/analyze` +
    `?visualFeatures=Color,Tags,Objects,Description`;

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/octet-stream",
        },
        body: new Blob([image]),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        return (await res.json()) as AzureVisionRaw;
      }

      // 4xx: client error — don't retry
      if (res.status >= 400 && res.status < 500) {
        const body = await res.text().catch(() => "");
        throw new VisionError(
          `Azure Vision ${res.status}: ${body.slice(0, 200)}`,
          "azure_error",
          res.status,
        );
      }

      lastError = new VisionError(
        `Azure Vision ${res.status}`,
        "azure_error",
        res.status,
      );
    } catch (e) {
      clearTimeout(timer);
      if (e instanceof VisionError && e.status && e.status < 500) throw e;
      if ((e as Error)?.name === "AbortError") {
        lastError = new VisionError("Azure Vision timed out", "timeout");
      } else {
        lastError = e;
      }
    }

    if (attempt < MAX_RETRIES) {
      await sleep(RETRY_BASE_DELAY_MS * Math.pow(2, attempt));
    }
  }

  if (lastError instanceof Error) throw lastError;
  throw new VisionError("Azure Vision failed after retries", "azure_error");
}

/** Pure mapping from Azure raw → AnalyzeResponse. Exported for testing. */
export function parseAzureResponse(raw: AzureVisionRaw): AnalyzeResponse {
  const seen = new Map<string, OutfitTag>();

  const candidates: { name: string; confidence: number }[] = [];
  for (const t of raw.tags ?? []) candidates.push({ name: t.name, confidence: t.confidence });
  for (const o of raw.objects ?? []) {
    candidates.push({ name: o.object, confidence: o.confidence });
  }

  for (const c of candidates) {
    const name = c.name.toLowerCase().trim();
    if (!name) continue;
    if (c.confidence < CONFIDENCE_THRESHOLD) continue;
    const category = classifyTag(name);
    if (category === null) continue;

    const existing = seen.get(name);
    if (!existing || existing.confidence < c.confidence) {
      seen.set(name, { name, confidence: round2(c.confidence), category });
    }
  }

  const tags = Array.from(seen.values()).sort((a, b) => b.confidence - a.confidence);

  if (tags.length === 0) {
    throw new VisionError(
      "No clothing items detected — try a clearer full-body photo",
      "no_clothing",
    );
  }

  // Colors: split dominance evenly across named buckets, reserve 10% for accent
  const dominantNames = (raw.color?.dominantColors ?? []).map((c) => c.toLowerCase());
  const colors: OutfitColor[] = [];

  if (dominantNames.length > 0) {
    const share = round2(1 / dominantNames.length);
    for (const name of dominantNames) {
      colors.push({ name, hex: colorNameToHex(name), dominance: share });
    }
  }

  if (raw.color?.accentColor && colors.length > 0) {
    const accentHex = normalizeHex(raw.color.accentColor);
    const alreadyPresent = colors.some((c) => c.hex === accentHex);
    if (!alreadyPresent) {
      const accentShare = 0.1;
      const totalCurrent = colors.reduce((s, c) => s + c.dominance, 0);
      const scale = (1 - accentShare) / totalCurrent;
      for (const c of colors) c.dominance = round2(c.dominance * scale);
      colors.push({ name: "accent", hex: accentHex, dominance: accentShare });
    }
  }

  const dominantColor = dominantNames[0] ?? "unknown";

  const rawTags = [
    ...(raw.tags ?? []).map((t) => t.name),
    ...(raw.description?.tags ?? []),
  ];

  return { tags, colors, dominantColor, rawTags };
}

/** Demo-safe fallback. Returned by the route when Azure is missing or fails. */
export const FALLBACK_RESPONSE: AnalyzeResponse = {
  tags: [
    { name: "shirt", confidence: 0.85, category: "clothing" },
    { name: "jeans", confidence: 0.82, category: "clothing" },
    { name: "sneakers", confidence: 0.8, category: "footwear" },
  ],
  colors: [
    { name: "blue", hex: "#1E3A8A", dominance: 0.5 },
    { name: "white", hex: "#FFFFFF", dominance: 0.3 },
    { name: "gray", hex: "#808080", dominance: 0.2 },
  ],
  dominantColor: "blue",
  rawTags: ["fallback"],
};

/** Main entry — call Azure, parse, return AnalyzeResponse. Throws VisionError. */
export async function analyzeImage(image: ArrayBuffer): Promise<AnalyzeResponse> {
  const raw = await callAzureVision(image);
  return parseAzureResponse(raw);
}
