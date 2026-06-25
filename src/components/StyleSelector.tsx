"use client";

import { Check } from "lucide-react";
import type { StyleVibe } from "@/types";
import { STYLES } from "@/lib/styleConfig";
import { cn } from "@/lib/utils";

const STYLE_EMOJIS: Record<StyleVibe, string> = {
  streetwear: "🔥", minimalist: "🤍", classic: "✨", bohemian: "🌿",
  sporty: "⚡", preppy: "🎀", edgy: "🖤", romantic: "🌸",
};

const GRADIENT_MAP: Record<StyleVibe, string> = {
  streetwear: "from-[#5b61e8] to-[#9b5de5]",
  minimalist: "from-[#8a8780] to-[#c9c2b4]",
  classic: "from-[#2f5e4e] to-[#000080]",
  bohemian: "from-[#8B4513] to-[#c8a26b]",
  sporty: "from-[#00bbf9] to-[#00f5d4]",
  preppy: "from-[#000080] to-[#7c8a72]",
  edgy: "from-[#1a1a1a] to-[#b45f45]",
  romantic: "from-[#f15bb5] to-[#fee440]",
};

export function StyleSelector({
  value,
  onChange,
}: {
  value: StyleVibe | null;
  onChange: (id: StyleVibe) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STYLES.map((style) => {
        const selected = value === style.id;
        return (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border-2 p-5 text-left transition-all duration-200 hover:-translate-y-1",
              selected
                ? "border-transparent shadow-xl scale-[1.02]"
                : "border-line bg-white hover:border-transparent hover:shadow-lg",
            )}
          >
            {/* Gradient background when selected */}
            {selected && (
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-100", GRADIENT_MAP[style.id])} />
            )}
            {/* Hover gradient */}
            {!selected && (
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-10", GRADIENT_MAP[style.id])} />
            )}

            <div className="relative">
              {/* Big emoji */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-4xl transition-transform group-hover:scale-110">
                  {STYLE_EMOJIS[style.id]}
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                    selected
                      ? "border-white bg-white text-ink"
                      : "border-line text-transparent",
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
              </div>

              <h3 className={cn(
                "text-lg font-black",
                selected ? "text-white" : "text-ink",
              )}>
                {style.name}
              </h3>
              <p className={cn(
                "mt-0.5 text-xs font-semibold uppercase tracking-wider",
                selected ? "text-white/70" : "text-clay",
              )}>
                {style.tagline}
              </p>
              <p className={cn(
                "mt-2 text-sm leading-relaxed",
                selected ? "text-white/80" : "text-muted",
              )}>
                {style.description}
              </p>

              {/* Swatch dots */}
              <div className="mt-3 flex gap-1.5">
                {style.swatch.map((hex, i) => (
                  <span key={i} className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: hex }} />
                ))}
              </div>

              <p className={cn(
                "mt-3 text-[10px] font-bold uppercase tracking-widest",
                selected ? "text-white/50" : "text-ink-soft/50",
              )}>
                stylist: {style.assistant}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}


