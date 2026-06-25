/**
 * Style memory aggregation.
 * Pure function — takes an array of OutfitRecords, returns a StyleMemory object.
 * Called inside POST /api/outfits after every save so memory stays current.
 */

import type { OutfitRecord, StyleMemory } from "@/types";

/** Tally an array of string values, return the top N by frequency. */
function topN(items: string[], n: number): string[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name]) => name);
}

/**
 * Determine style trend from the most recent outfits.
 * - "improving"  → average of last 3 scores is higher than the 3 before that
 * - "consistent" → scores within ±5 of each other
 * - "exploring"  → everything else (mixed or insufficient data)
 */
function calcTrend(scores: number[]): StyleMemory["style_trend"] {
  if (scores.length < 3) return "exploring";

  const recent = scores.slice(-3);
  const recentAvg = recent.reduce((s, n) => s + n, 0) / recent.length;

  if (scores.length >= 6) {
    const older = scores.slice(-6, -3);
    const olderAvg = older.reduce((s, n) => s + n, 0) / older.length;
    if (recentAvg - olderAvg >= 5) return "improving";
  }

  const max = Math.max(...recent);
  const min = Math.min(...recent);
  if (max - min <= 5) return "consistent";

  return "exploring";
}

/** Build a StyleMemory snapshot from a user's full outfit history. */
export function aggregateMemory(
  userId: string,
  outfits: OutfitRecord[],
): StyleMemory {
  if (outfits.length === 0) {
    return {
      user_id: userId,
      total_outfits: 0,
      avg_score: 0,
      top_colors: [],
      top_items: [],
      style_trend: "exploring",
      updated_at: new Date().toISOString(),
    };
  }

  const scores = outfits
    .slice()
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((o) => o.score);

  const avg_score =
    Math.round((scores.reduce((s, n) => s + n, 0) / scores.length) * 100) / 100;

  const allColors = outfits.flatMap((o) => o.colors.map((c) => c.name.toLowerCase()));
  const allItems = outfits.flatMap((o) =>
    o.tags
      .filter((t) => t.category === "clothing" || t.category === "footwear")
      .map((t) => t.name.toLowerCase()),
  );

  return {
    user_id: userId,
    total_outfits: outfits.length,
    avg_score,
    top_colors: topN(allColors, 3),
    top_items: topN(allItems, 3),
    style_trend: calcTrend(scores),
    updated_at: new Date().toISOString(),
  };
}
