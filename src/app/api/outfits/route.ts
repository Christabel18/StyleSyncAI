/** GET/POST /api/outfits
 *  P4 owns this — Supabase outfit CRUD
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // TODO (P4): Fetch outfits from Supabase
  return NextResponse.json({ outfits: [] });
}

export async function POST(request: NextRequest) {
  // TODO (P4): Save outfit to Supabase
  const body = await request.json();
  return NextResponse.json({ message: "Outfit saved", data: body });
}
