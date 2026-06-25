"use client";

import { Check } from "lucide-react";
import type { StyleVibe } from "@/types";
import { STYLES } from "@/lib/styleConfig";
import { cn } from "@/lib/utils";

export function StyleSelector({
  value,
  onChange,
}: {
  value: StyleVibe | null;
  onChange: (id: StyleVibe) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STYLES.map((style) => {
        const selected = value === style.id;
        return (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={cn(
              "relative rounded-3xl border p-5 text-left transition-all duration-200",
              selected
                ? "border-clay bg-clay-soft/50 shadow-md"
                : "border-line bg-white hover:border-clay/40 hover:shadow-sm",
            )}
          >
            {/* Color swatches */}
            <div className="mb-4 flex gap-1.5">
              {style.swatch.map((hex, i) => (
                <span
                  key={i}
                  className="h-7 w-7 rounded-full ring-1 ring-black/10"
                  style={{ background: hex }}
                />
              ))}
            </div>

            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-ink">{style.name}</p>
                <p className="mt-0.5 text-sm font-medium text-clay">
                  {style.tagline}
                </p>
              </div>
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                  selected
                    ? "border-clay bg-clay text-white"
                    : "border-line text-transparent",
                )}
              >
                <Check className="h-3 w-3" />
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              {style.description}
            </p>

            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-ink-soft/60">
              Stylist: {style.assistant}
            </p>
          </button>
        );
      })}
    </div>
  );
}
