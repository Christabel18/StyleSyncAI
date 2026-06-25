/** GET  /api/memory?user_id= — fetch aggregated style memory for a user
 *  POST /api/memory           — manually trigger memory upsert (optional util)
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { aggregateMemory } from "@/lib/memory";
import type { StyleMemory, OutfitRecord } from "@/types";

export async function GET(request: NextRequest) {
  const user_id = request.nextUrl.searchParams.get("user_id");
  if (!user_id) {
    return NextResponse.json({ error: "Missing ?user_id= parameter" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("style_memory")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error || !data) {
    // No memory yet — return a zeroed-out shell so the client doesn't crash
    const empty: StyleMemory = {
      user_id,
      total_outfits: 0,
      avg_score: 0,
      top_colors: [],
      top_items: [],
      style_trend: "exploring",
      updated_at: new Date().toISOString(),
    };
    return NextResponse.json<{ memory: StyleMemory }>({ memory: empty });
  }

  return NextResponse.json<{ memory: StyleMemory }>({ memory: data });
}

export async function POST(request: NextRequest) {
  let body: { user_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { user_id } = body;
  if (!user_id) {
    return NextResponse.json({ error: "Missing required field: user_id" }, { status: 400 });
  }

  const { data: outfits, error: fetchError } = await supabase
    .from("outfits")
    .select("*")
    .eq("user_id", user_id);

  if (fetchError) {
    console.error("[/api/memory POST] Supabase fetch error:", fetchError);
    return NextResponse.json({ error: "Failed to fetch outfits for aggregation" }, { status: 500 });
  }

  const memory = aggregateMemory(user_id, (outfits ?? []) as OutfitRecord[]);

  const { data: upserted, error: upsertError } = await supabase
    .from("style_memory")
    .upsert(memory, { onConflict: "user_id" })
    .select()
    .single();

  if (upsertError) {
    console.error("[/api/memory POST] Supabase upsert error:", upsertError);
    return NextResponse.json({ error: "Failed to update style memory" }, { status: 500 });
  }

  return NextResponse.json<{ memory: StyleMemory }>({ memory: upserted });
}
