"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2, Sparkles } from "lucide-react";
import type { StyleMemory } from "@/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ColorPalette } from "@/components/ColorPalette";
import { OutfitHistoryGrid } from "@/components/OutfitHistoryGrid";
import { loadMemory, clearMemory } from "@/lib/styleMemory";
import { getStyle } from "@/lib/styles";

const EMPTY: StyleMemory = {
  favoriteColors: [],
  commonItems: [],
  sessions: [],
};

export default function HistoryPage() {
  const [memory, setMemory] = useState<StyleMemory>(EMPTY);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setMemory(loadMemory());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("stylesync:memory", refresh);
    return () => window.removeEventListener("stylesync:memory", refresh);
  }, [refresh]);

  const hasData = ready && memory.sessions.length > 0;

  return (
    <Container className="py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-clay">
            Style memory
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Your style, remembered
          </h1>
          <p className="mt-3 max-w-lg text-ink-soft">
            Every look you analyze sharpens your stylist&apos;s sense of your
            taste — your colors, your go-to pieces, your vibe.
          </p>
        </div>
        {hasData && (
          <button
            type="button"
            onClick={clearMemory}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-clay-dark hover:text-clay-dark"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {!hasData ? (
        <div className="mt-12 rounded-3xl border border-line bg-card p-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clay-soft text-clay">
            <Sparkles className="h-6 w-6" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
            Nothing here yet
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Analyze your first outfit and it&apos;ll start showing up here.
          </p>
          <Button href="/upload" className="mt-6">
            Analyze an outfit
          </Button>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <div className="rounded-3xl border border-line bg-card p-6">
              <p className="text-[11px] uppercase tracking-wider text-muted">
                Preferred style
              </p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">
                {memory.preferredStyle
                  ? getStyle(memory.preferredStyle).name
                  : "—"}
              </p>
              {memory.preferredStyle && (
                <p className="mt-1 text-sm text-clay">
                  {getStyle(memory.preferredStyle).tagline}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-line bg-card p-6">
              <p className="text-[11px] uppercase tracking-wider text-muted">
                Favorite colors
              </p>
              <div className="mt-3">
                <ColorPalette colors={memory.favoriteColors} />
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-card p-6">
              <p className="text-[11px] uppercase tracking-wider text-muted">
                Common pieces
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {memory.commonItems.length ? (
                  memory.commonItems.map((item) => (
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
            </div>
          </div>

          {/* History grid */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Outfit history
            </h2>
            <p className="text-sm text-muted">
              {memory.sessions.length} look
              {memory.sessions.length === 1 ? "" : "s"} analyzed
            </p>
            <div className="mt-6">
              <OutfitHistoryGrid sessions={memory.sessions} />
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
