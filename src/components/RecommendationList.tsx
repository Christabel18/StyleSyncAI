import { Sparkles, Wrench } from "lucide-react";
import type { RecommendationResult } from "@/types";

export function RecommendationList({
  result,
}: {
  result: RecommendationResult;
}) {
  return (
    <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-ink">Recommendations</h3>
        {result.fallbackUsed && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs text-muted">
            <Wrench className="h-3 w-3" />
            quick picks
          </span>
        )}
      </div>

      <ul className="mt-4 space-y-3">
        {result.recommendations.map((rec) => (
          <li
            key={rec.id}
            className="group flex items-start gap-4 rounded-2xl border border-line p-4 transition-colors hover:border-clay/40 hover:bg-clay-soft/30"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay-soft text-clay">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-ink">{rec.title}</p>
                <span className="text-[11px] uppercase tracking-wider text-muted">
                  {Math.round(rec.confidence * 100)}%
                </span>
              </div>
              <p className="mt-0.5 text-sm text-ink-soft">{rec.reason}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
