/** GET  /api/outfits?user_id= — fetch outfit history for a user (newest first)
 *  POST /api/outfits          — save a new outfit, then upsert style_memory
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { aggregateMemory } from "@/lib/memory";
import type { OutfitRecord } from "@/types";

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");
  if (!user_id) {
    return NextResponse.json({ error: "Missing ?user_id= parameter" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("outfits")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[/api/outfits GET] Supabase error:", error);
    return NextResponse.json({ error: "Failed to fetch outfits" }, { status: 500 });
  }

  return NextResponse.json<{ outfits: OutfitRecord[] }>({ outfits: data ?? [] });
}

export async function POST(request: NextRequest) {
  let body: Omit<OutfitRecord, "id" | "created_at">;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { user_id, tags, colors, score, recommendations, assistant_message, image_url } = body;
  if (!user_id || !tags || !colors || score === undefined || !recommendations) {
    return NextResponse.json(
      { error: "Missing required fields: user_id, tags, colors, score, recommendations" },
      { status: 400 },
    );
  }

  // ── Save the outfit ──────────────────────────────────────────────────────────
  const { data: saved, error: insertError } = await supabase
    .from("outfits")
    .insert({ user_id, tags, colors, score, recommendations, assistant_message, image_url })
    .select()
    .single();

  if (insertError || !saved) {
    console.error("[/api/outfits POST] Supabase insert error:", insertError);
    return NextResponse.json({ error: "Failed to save outfit" }, { status: 500 });
  }

  // ── Regenerate style memory ───────────────────────────────────────────────
  // Fire-and-forget in the background so the client gets a fast response.
  (async () => {
    const { data: allOutfits, error: fetchError } = await supabase
      .from("outfits")
      .select("*")
      .eq("user_id", user_id);

    if (fetchError || !allOutfits) return;

    const memory = aggregateMemory(user_id, allOutfits as OutfitRecord[]);
    await supabase
      .from("style_memory")
      .upsert(memory, { onConflict: "user_id" });
  })();

  return NextResponse.json<OutfitRecord>(saved, { status: 201 });
}
