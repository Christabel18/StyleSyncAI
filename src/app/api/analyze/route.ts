/** POST /api/analyze
 *  P2 owns this — Azure Vision integration
 *  Takes: FormData with image file
 *  Returns: AnalyzeResponse (tags, colors, dominantColor)
 */

import { NextResponse } from "next/server";
import type { AnalyzeResponse } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST() {
  // TODO (P2): Implement Azure Vision integration
  // 1. Read FormData image from request
  // 2. Send to Azure AI Vision API
  // 3. Filter tags by confidence >= 0.7
  // 4. Map Azure color names to HEX
  // 5. Return AnalyzeResponse

  const placeholder: AnalyzeResponse = {
    tags: [
      { name: "blazer", confidence: 0.92, category: "clothing" },
      { name: "jeans", confidence: 0.88, category: "clothing" },
      { name: "sneakers", confidence: 0.85, category: "footwear" },
    ],
    colors: [
      { name: "navy", hex: "#000080", dominance: 0.4 },
      { name: "blue", hex: "#0000FF", dominance: 0.35 },
      { name: "white", hex: "#FFFFFF", dominance: 0.25 },
    ],
    dominantColor: "navy",
    rawTags: ["blazer", "jeans", "sneakers", "person", "indoor"],
  };

  return NextResponse.json(placeholder);
}
