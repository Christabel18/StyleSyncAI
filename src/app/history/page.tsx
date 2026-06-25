"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import type { OutfitRecord } from "@/types";
import { OutfitHistoryGrid } from "@/components/OutfitHistoryGrid";
import { useAppStore } from "@/store/useAppStore";

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-6">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{label}</p>
      <div className="mt-2">{value}</div>
    </div>
  );
}

export default function HistoryPage() {
  const { history, clearHistory } = useAppStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const records = mounted ? (history as OutfitRecord[]) : [];
  const hasData = records.length > 0;

  const avgScore =
    records.length > 0
      ? Math.round(records.reduce((s, r) => s + r.score, 0) / records.length)
      : null;

  const topColors = Array.from(
    new Map(
      records
        .flatMap((r) => r.colors)
        .sort((a, b) => b.dominance - a.dominance)
        .map((c) => [c.name, c] as [string, typeof c]),
    ).values(),
  ).slice(0, 6);

  const topItems = Array.from(
    new Set(
      records
        .flatMap((r) => r.tags)
        .filter((t) => t.category === "clothing" && t.confidence > 0.75)
        .map((t) => t.name),
    ),
  ).slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-sm font-medium uppercase tracking-widest text-clay">
            Style memory
          </span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Your style, remembered
          </h1>
          <p className="mt-3 max-w-lg text-lg text-ink-soft">
            Every look you analyze sharpens your stylist&apos;s sense of your
            taste — your colors, your go-to pieces, your vibe.
          </p>
        </div>
        {hasData && (
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-base text-ink-soft transition-colors hover:border-clay-dark hover:text-clay-dark"
          >
            <Trash2 className="h-5 w-5" />
            Clear
          </button>
        )}
      </div>

      {!hasData ? (
        <div className="mt-12 rounded-3xl border border-line bg-white p-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clay-soft text-clay">
            <Sparkles className="h-6 w-6" />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-ink">Nothing here yet</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Analyze your first outfit and it&apos;ll start showing up here.
          </p>
          <Link
            href="/upload"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-cream transition-colors hover:bg-clay"
          >
            Analyze an outfit
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <StatCard
              label="Looks analyzed"
              value={
                <p className="text-3xl font-bold text-ink">{records.length}</p>
              }
            />
            <StatCard
              label="Average score"
              value={
                avgScore !== null ? (
                  <p className="text-3xl font-bold text-clay">{avgScore}/100</p>
                ) : (
                  <span className="text-muted">—</span>
                )
              }
            />
            <StatCard
              label="Go-to pieces"
              value={
                <div className="flex flex-wrap gap-2">
                  {topItems.length ? (
                    topItems.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-sand px-3 py-1 text-sm capitalize text-ink-soft"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted">—</span>
                  )}
                </div>
              }
            />
          </div>

          {topColors.length > 0 && (
            <div className="mt-6 rounded-3xl border border-line bg-white p-6">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Favourite colors
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {topColors.map((c) => (
                  <span
                    key={c.name}
                    className="inline-flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm"
                  >
                    <span
                      className="h-6 w-6 rounded-full"
                      style={{ background: c.hex }}
                    />
                    <span className="capitalize text-ink-soft">{c.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-ink">Outfit history</h2>
            <p className="text-sm text-muted">
              {records.length} look{records.length === 1 ? "" : "s"} analyzed
            </p>
            <div className="mt-6">
              <OutfitHistoryGrid records={records} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
