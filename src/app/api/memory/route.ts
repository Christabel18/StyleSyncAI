/** GET/POST /api/memory
 *  P4 owns this — Style memory aggregation
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // TODO (P4): Fetch user style memory from Supabase
  return NextResponse.json({ memory: null });
}

export async function POST(request: NextRequest) {
  // TODO (P4): Update style memory after outfit save
  const body = await request.json();
  return NextResponse.json({ message: "Memory updated", data: body });
}
