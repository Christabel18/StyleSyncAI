/** POST /api/user  — create a new user profile (returns UUID for localStorage)
 *  GET  /api/user?id= — fetch existing user profile
 *
 *  No authentication. The client stores the returned UUID in localStorage
 *  and passes it with every subsequent request.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing ?id= parameter" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json<UserProfile>(data);
}

export async function POST(request: NextRequest) {
  let body: { style_vibe?: string; assistant?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { style_vibe, assistant } = body;
  if (!style_vibe) {
    return NextResponse.json({ error: "Missing required field: style_vibe" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .insert({ style_vibe, assistant: assistant ?? "Nova" })
    .select()
    .single();

  if (error || !data) {
    console.error("[/api/user] Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }

  return NextResponse.json<UserProfile>(data, { status: 201 });
}
