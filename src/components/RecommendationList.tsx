import { Sparkles } from "lucide-react";
import type { Recommendation } from "@/types";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<
  Recommendation["type"],
  { label: string; classes: string }
> = {
  keep: {
    label: "Keep",
    classes: "bg-green-50 text-green-700 border-green-200",
  },
  add: { label: "Add", classes: "bg-clay-soft text-clay-dark border-clay/30" },
  swap: {
    label: "Swap",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
  },
  remove: {
    label: "Remove",
    classes: "bg-red-50 text-red-600 border-red-200",
  },
};

const PRIORITY_DOT: Record<Recommendation["priority"], string> = {
  high: "bg-clay",
  medium: "bg-yellow-400",
  low: "bg-green-400",
};

export function RecommendationList({
  recommendations,
  fallbackUsed = false,
}: {
  recommendations: Recommendation[];
  fallbackUsed?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-ink">Recommendations</h3>
        {fallbackUsed && (
          <span className="rounded-full bg-sand px-3 py-1 text-xs text-muted">
            quick picks
          </span>
        )}
      </div>

      <ul className="mt-4 space-y-3">
        {recommendations.map((rec, i) => {
          const ts = TYPE_STYLES[rec.type];
          return (
            <li
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-line p-4 transition-colors hover:border-clay/40 hover:bg-clay-soft/20"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay-soft text-clay">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink capitalize">{rec.item}</p>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-xs font-medium",
                      ts.classes,
                    )}
                  >
                    {ts.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        PRIORITY_DOT[rec.priority],
                      )}
                    />
                    {rec.priority}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-ink-soft">{rec.reason}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
