/** POST /api/analyze
 *  P2 — Azure Vision integration.
 *
 *  Request:  multipart/form-data with field "image" (JPEG/PNG/WebP/HEIC, ≤10MB)
 *  Response: AnalyzeResponse (200) or { error } (4xx)
 *
 *  Demo safety: when Azure is missing, times out, or returns no clothing,
 *  responds 200 with FALLBACK_RESPONSE and sets X-StyleSync-Fallback header
 *  so the UI never crashes mid-demo. The reason is logged server-side.
 */

import { NextResponse } from "next/server";
import type { AnalyzeResponse } from "@/types";
import { analyzeImage, FALLBACK_RESPONSE, VisionError } from "@/lib/vision";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_MIME = /^image\/(jpeg|jpg|png|webp|heic|heif)$/i;

export async function POST(req: Request): Promise<NextResponse> {
  let image: ArrayBuffer;
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing 'image' field in FormData" },
        { status: 400 },
      );
    }
    if (!ACCEPTED_MIME.test(file.type)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${file.type || "unknown"}` },
        { status: 415 },
      );
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        {
          error: `Image too large (${file.size} bytes, max ${MAX_IMAGE_BYTES})`,
        },
        { status: 413 },
      );
    }

    image = await file.arrayBuffer();
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid request body — expected multipart/form-data with 'image' field",
      },
      { status: 400 },
    );
  }

  try {
    const result = await analyzeImage(image);
    return NextResponse.json<AnalyzeResponse>(result);
  } catch (e) {
    const code = e instanceof VisionError ? e.code : "unknown";
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[/api/analyze] error (${code}): ${message}`);

    // "no_clothing" means Azure ran fine but found nothing — tell the user to retry
    // with a better photo rather than returning fake data
    if (code === "no_clothing") {
      return NextResponse.json(
        { error: "No clothing detected. Try a clearer full-body photo with good lighting." },
        { status: 422 },
      );
    }

    // For Azure being down / misconfigured / timed out — use fallback so demo never crashes
    const fallback: AnalyzeResponse = {
      ...FALLBACK_RESPONSE,
      rawTags: [`fallback:${code}`],
    };
    return NextResponse.json<AnalyzeResponse>(fallback, {
      headers: { "X-StyleSync-Fallback": code },
    });
  }
}
