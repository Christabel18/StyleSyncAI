"use client";

import { motion } from "framer-motion";

/** Circular progress ring for an individual score (0–100). */
export function ScoreRing({
  value,
  label,
  size = 132,
  primary = false,
}: {
  value: number;
  label: string;
  size?: number;
  primary?: boolean;
}) {
  const stroke = primary ? 9 : 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = primary ? "var(--color-clay)" : "var(--color-ink)";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display font-semibold leading-none"
            style={{
              fontSize: primary ? size * 0.32 : size * 0.26,
              color,
            }}
          >
            {value}
          </span>
          {primary && (
            <span className="mt-1 text-[10px] uppercase tracking-widest text-muted">
              / 100
            </span>
          )}
        </div>
      </div>
      <span className="text-sm font-medium text-ink-soft">{label}</span>
    </div>
  );
}
