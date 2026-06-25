"use client";

import { useEffect, useState } from "react";

/** Animated SVG score ring. Transitions from 0 → value on mount. */
export function ScoreRing({
  value,
  label,
  size = 128,
  accent = "#b45f45",
  primary = false,
}: {
  value: number;
  label: string;
  size?: number;
  accent?: string;
  primary?: boolean;
}) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDisplayed(value), 60);
    return () => clearTimeout(t);
  }, [value]);

  const stroke = primary ? 9 : 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (displayed / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
          aria-label={`${label}: ${value} out of 100`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#e4ddd1"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={accent}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold leading-none"
            style={{
              fontSize: primary ? size * 0.3 : size * 0.24,
              color: accent,
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
