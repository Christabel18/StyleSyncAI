import type { Recommendation, AssistantName } from "@/types";
import { PERSONAS } from "@/lib/styleConfig";
import { AVATARS } from "@/components/PersonaAvatars";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<Recommendation["type"], string> = {
  keep: "✓ Keep",
  add: "+ Add",
  swap: "⇄ Swap",
  remove: "✕ Remove",
};

const TYPE_BUBBLE: Record<Recommendation["type"], string> = {
  keep: "bg-emerald-500",
  add: "bg-clay",
  swap: "bg-blue-500",
  remove: "bg-red-400",
};

const PRIORITY_DOT: Record<Recommendation["priority"], string> = {
  high: "bg-clay",
  medium: "bg-yellow-400",
  low: "bg-emerald-400",
};

export function RecommendationList({
  recommendations,
  assistant = "Nova",
  fallbackUsed = false,
}: {
  recommendations: Recommendation[];
  assistant?: AssistantName;
  fallbackUsed?: boolean;
}) {
  const persona = PERSONAS[assistant];
  const AvatarComponent = AVATARS[assistant];

  return (
    <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-ink">Style tips</h3>
        {fallbackUsed && (
          <span className="rounded-full bg-sand px-3 py-1 text-xs text-muted">
            quick picks
          </span>
        )}
      </div>

      {/* Chat-style recommendations */}
      <div className="mt-5 space-y-4">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex items-start gap-3">
            {/* Small avatar */}
            <div className="shrink-0">
              <div
                className="overflow-hidden rounded-full"
                style={{ boxShadow: `0 0 0 2px ${persona.color}` }}
              >
                <AvatarComponent size={36} />
              </div>
            </div>

            {/* Chat bubble */}
            <div className="relative flex-1">
              {/* Bubble tail */}
              <div
                className="absolute -left-2 top-2.5 h-0 w-0"
                style={{
                  borderTop: "5px solid transparent",
                  borderBottom: "5px solid transparent",
                  borderRight: `8px solid ${persona.color}`,
                  opacity: 0.15,
                }}
              />
              <div
                className="rounded-2xl rounded-tl-sm border p-3.5"
                style={{ borderColor: `${persona.color}30`, background: persona.bg }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold text-white",
                      TYPE_BUBBLE[rec.type],
                    )}
                  >
                    {TYPE_LABEL[rec.type]}
                  </span>
                  <span className="font-semibold text-sm text-ink capitalize">
                    {rec.item}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted ml-auto">
                    <span className={cn("h-1.5 w-1.5 rounded-full", PRIORITY_DOT[rec.priority])} />
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-ink-soft leading-relaxed">{rec.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
