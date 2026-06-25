"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import type { StyleId } from "@/types";
import { STYLES } from "@/lib/styles";
import { cn } from "@/lib/cn";

export function StyleSelector({
  value,
  onChange,
}: {
  value?: StyleId;
  onChange: (id: StyleId) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STYLES.map((style, i) => {
        const selected = value === style.id;
        return (
          <motion.button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "group relative overflow-hidden rounded-3xl border p-5 text-left transition-all",
              selected
                ? "border-clay bg-clay-soft/50 shadow-md"
                : "border-line bg-card hover:border-clay/40 hover:shadow-sm",
            )}
          >
            <div className="mb-4 flex gap-1.5">
              {style.swatch.map((hex, j) => (
                <span
                  key={j}
                  className="h-8 w-8 rounded-full ring-1 ring-black/5"
                  style={{ background: hex }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">
                {style.name}
              </h3>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border transition-all",
                  selected
                    ? "border-clay bg-clay text-white"
                    : "border-line text-transparent",
                )}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-0.5 text-sm font-medium text-clay">
              {style.tagline}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {style.description}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
