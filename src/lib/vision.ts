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

const CONFIDENCE_THRESHOLD = 0.6;
const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 500;

// ── Colour helpers ────────────────────────────────────────────────────────────

/** Background/neutral colours that Azure often picks up from streets, walls, sky. */
const BACKGROUND_COLOURS = new Set(["grey", "gray", "white", "beige", "ivory", "cream"]);

/** Vivid fashion colours that should be promoted over background neutrals. */
const VIVID_FASHION_COLOURS = new Set([
  "orange", "red", "pink", "coral", "yellow", "gold", "mustard",
  "green", "olive", "teal", "blue", "navy", "sky", "purple",
  "lavender", "burgundy", "maroon", "brown", "tan", "camel", "khaki",
]);

/** Hex → rough colour name for accent promotion. */
function hexToColourName(hex: string): string {
  const h = hex.replace("#", "").toLowerCase();
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;

  if (chroma < 30) {
    if (r > 200 && g > 200 && b > 200) return "white";
    if (r < 60 && g < 60 && b < 60) return "black";
    return "grey";
  }

  const hue = (() => {
    if (max === r) return ((g - b) / chroma + (g < b ? 6 : 0)) / 6;
    if (max === g) return ((b - r) / chroma + 2) / 6;
    return ((r - g) / chroma + 4) / 6;
  })();

  const h360 = hue * 360;
  if (h360 < 20 || h360 >= 340) return "red";
  if (h360 < 40) return "orange";
  if (h360 < 65) return "yellow";
  if (h360 < 155) return "green";
  if (h360 < 185) return "teal";
  if (h360 < 250) return "blue";
  if (h360 < 290) return "purple";
  if (h360 < 340) return "pink";
  return "red";
}

/**
 * Build the final colour list.
 *
 * Problem: Azure averages the whole image including background (buildings, road,
 * sky) so dominantColors is often all grey/white even when the outfit is vividly
 * coloured.
 *
 * Fix: if all dominant colours are background neutrals AND the accentColor
 * resolves to a vivid fashion colour, promote the accent to dominant.
 * Also always include the accent as a named colour entry (not just "accent").
 */
function buildColours(
  raw: AzureVisionRaw,
): { colors: OutfitColor[]; dominantColor: string } {
  const dominantNames = (raw.color?.dominantColors ?? []).map((c) => c.toLowerCase());
  const accentHex = raw.color?.accentColor ? normalizeHex(raw.color.accentColor) : null;
  const accentName = accentHex ? hexToColourName(accentHex) : null;

  const allBackground =
    dominantNames.length > 0 &&
    dominantNames.every((n) => BACKGROUND_COLOURS.has(n));
  const accentIsVivid = accentName ? VIVID_FASHION_COLOURS.has(accentName) : false;

  // If Azure only returned background colours and we have a vivid accent,
  // promote the accent to the primary colour and push dominant colours to secondary.
  let primaryNames: string[];
  if (allBackground && accentIsVivid && accentName) {
    primaryNames = [accentName, ...dominantNames.filter((n) => n !== accentName)];
  } else {
    primaryNames = dominantNames;
  }

  const colors: OutfitColor[] = [];

  if (primaryNames.length > 0) {
    const share = round2(1 / primaryNames.length);
    const seen = new Set<string>();
    for (const name of primaryNames) {
      if (seen.has(name)) continue;
      seen.add(name);
      colors.push({
        name,
        hex: colorNameToHex(name),
        dominance: share,
      });
    }
  }

  // Add accent as a named entry if it isn't already present
  if (accentHex && accentName) {
    const alreadyPresent = colors.some(
      (c) => c.hex === accentHex || c.name === accentName,
    );
    if (!alreadyPresent && colors.length > 0) {
      const accentShare = 0.1;
      const totalCurrent = colors.reduce((s, c) => s + c.dominance, 0);
      const scale = (1 - accentShare) / totalCurrent;
      for (const c of colors) c.dominance = round2(c.dominance * scale);
      colors.push({ name: accentName, hex: accentHex, dominance: accentShare });
    }
  }

  const dominantColor = colors[0]?.name ?? dominantNames[0] ?? "unknown";
  return { colors, dominantColor };
}

// ── Caption-based tag enrichment ─────────────────────────────────────────────

/**
 * Extract specific garment names from Azure's description caption.
 * Azure tags are broad ("trousers", "footwear") but captions are descriptive:
 * "a woman wearing an orange crop top and black cargo pants with white sneakers"
 * We parse that for specific terms Azure's tag classifier missed.
 */
const CAPTION_GARMENT_PATTERNS: Array<{
  pattern: RegExp;
  name: string;
  category: OutfitTag["category"];
}> = [
  // Tops
  { pattern: /crop\s+top/i, name: "crop top", category: "clothing" },
  { pattern: /tank\s+top/i, name: "tank top", category: "clothing" },
  { pattern: /t[-\s]?shirt/i, name: "t-shirt", category: "clothing" },
  { pattern: /hoodie/i, name: "hoodie", category: "clothing" },
  { pattern: /sweatshirt/i, name: "sweatshirt", category: "clothing" },
  { pattern: /flannel/i, name: "flannel shirt", category: "clothing" },
  { pattern: /plaid\s+shirt/i, name: "plaid shirt", category: "clothing" },
  // Bottoms
  { pattern: /cargo\s+pants/i, name: "cargo pants", category: "clothing" },
  { pattern: /jogger/i, name: "joggers", category: "clothing" },
  { pattern: /camo(uflage)?\s+(pants|trousers)/i, name: "camo pants", category: "clothing" },
  { pattern: /jeans/i, name: "jeans", category: "clothing" },
  { pattern: /chinos/i, name: "chinos", category: "clothing" },
  { pattern: /shorts/i, name: "shorts", category: "clothing" },
  // Outerwear
  { pattern: /field\s+jacket/i, name: "field jacket", category: "clothing" },
  { pattern: /trench\s+coat/i, name: "trench coat", category: "clothing" },
  { pattern: /bomber/i, name: "bomber jacket", category: "clothing" },
  { pattern: /leather\s+jacket/i, name: "leather jacket", category: "clothing" },
  // Footwear
  { pattern: /sneakers?/i, name: "sneakers", category: "footwear" },
  { pattern: /trainers?/i, name: "trainers", category: "footwear" },
  { pattern: /boots?/i, name: "boots", category: "footwear" },
  { pattern: /loafers?/i, name: "loafers", category: "footwear" },
  { pattern: /heels?/i, name: "heels", category: "footwear" },
  { pattern: /vans/i, name: "sneakers", category: "footwear" },
  { pattern: /converse/i, name: "sneakers", category: "footwear" },
  { pattern: /air\s+force/i, name: "sneakers", category: "footwear" },
  // Accessories
  { pattern: /sunglasses/i, name: "sunglasses", category: "accessory" },
  { pattern: /gloves/i, name: "gloves", category: "accessory" },
  { pattern: /handbag/i, name: "handbag", category: "accessory" },
  { pattern: /tote\s+bag/i, name: "tote bag", category: "accessory" },
  { pattern: /backpack/i, name: "backpack", category: "accessory" },
  { pattern: /scarf/i, name: "scarf", category: "accessory" },
  { pattern: /cap\b/i, name: "cap", category: "accessory" },
];

function extractCaptionTags(raw: AzureVisionRaw): Array<{ name: string; confidence: number; category: OutfitTag["category"] }> {
  const captions = raw.description?.captions ?? [];
  if (captions.length === 0) return [];

  const text = captions.map((c) => c.text).join(" ");
  const found: Array<{ name: string; confidence: number; category: OutfitTag["category"] }> = [];

  for (const { pattern, name, category } of CAPTION_GARMENT_PATTERNS) {
    if (pattern.test(text)) {
      // Caption-extracted items get confidence = 0.75 (below top tag but above threshold)
      found.push({ name, confidence: 0.75, category });
    }
  }
  return found;
}

// ── Footwear normalisation ────────────────────────────────────────────────────

/**
 * Azure often returns "high heels" for ANY shoe in a fashion context — even
 * flat sneakers. Cross-check with rawTags and caption. If the description
 * mentions sneakers/trainers or the raw tags include flat-shoe terms,
 * downgrade "high heels" to "shoes".
 */
function normalizeFootwear(
  tags: OutfitTag[],
  rawTags: string[],
  captionText: string,
): OutfitTag[] {
  const flatIndicators = [
    "sneaker", "trainer", "flat", "low", "vans", "converse", "nike", "adidas",
    "canvas", "tennis shoe", "running shoe",
  ];

  const rawLower = rawTags.map((t) => t.toLowerCase()).join(" ");
  const captionLower = captionText.toLowerCase();
  const context = rawLower + " " + captionLower;

  const hasFlatContext = flatIndicators.some((word) => context.includes(word));

  return tags.map((tag) => {
    if (tag.name === "high heels" && hasFlatContext) {
      return { ...tag, name: "shoes", confidence: tag.confidence };
    }
    return tag;
  });
}

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

  // 1. Seed from Azure tags + objects
  const candidates: { name: string; confidence: number }[] = [];
  for (const t of raw.tags ?? []) candidates.push({ name: t.name, confidence: t.confidence });
  for (const o of raw.objects ?? []) candidates.push({ name: o.object, confidence: o.confidence });

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

  // 2. Enrich with caption-extracted specific garment names
  const captionTags = extractCaptionTags(raw);
  for (const ct of captionTags) {
    const existing = seen.get(ct.name);
    if (!existing) {
      seen.set(ct.name, { name: ct.name, confidence: ct.confidence, category: ct.category });
    }
  }

  if (seen.size === 0) {
    throw new VisionError(
      "No clothing items detected — try a clearer full-body photo",
      "no_clothing",
    );
  }

  // 3. Footwear normalisation (fix "high heels" → "shoes" when context says flat)
  const captionText = (raw.description?.captions ?? []).map((c) => c.text).join(" ");
  const rawTagNames = [
    ...(raw.tags ?? []).map((t) => t.name),
    ...(raw.description?.tags ?? []),
  ];

  let tags = Array.from(seen.values()).sort((a, b) => b.confidence - a.confidence);
  tags = normalizeFootwear(tags, rawTagNames, captionText);

  // 4. Build colours with background-skew correction
  const { colors, dominantColor } = buildColours(raw);

  return { tags, colors, dominantColor, rawTags: rawTagNames };
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
