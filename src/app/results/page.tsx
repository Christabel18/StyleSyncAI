"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { AnalysisCard } from "@/components/AnalysisCard";
import { AssistantMessage } from "@/components/AssistantMessage";
import { RecommendationList } from "@/components/RecommendationList";
import { LoadingState } from "@/components/StateViews";
import { useAppStore } from "@/store/useAppStore";
import { getStyleMeta, PERSONAS } from "@/lib/styleConfig";

function EmptyResults() {
  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clay-soft text-clay">
        <Sparkles className="h-6 w-6" />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-ink">No analysis yet</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Upload an outfit and your stylist will break it down here.
      </p>
      <Link
        href="/upload"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-cream transition-colors hover:bg-clay"
      >
        Analyze an outfit
      </Link>
    </div>
  );
}

export default function ResultsPage() {
  const { currentSession } = useAppStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-md px-5 py-12">
        <LoadingState message="Loading your report…" sub="One moment" />
      </div>
    );
  }

  if (!currentSession) return <EmptyResults />;

  const { analysis, result, style, imageDataUrl } = currentSession;
  const styleMeta = getStyleMeta(style);
  const persona = PERSONAS[result.assistantMessage.assistant];

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex items-center justify-between">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-clay"
        >
          <ArrowLeft className="h-4 w-4" />
          Style memory
        </Link>
        <span className="text-xs text-muted">
          {new Date(currentSession.createdAt).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="mt-4">
        <span className="text-xs font-medium uppercase tracking-widest text-clay">
          Your style report
        </span>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          {styleMeta.name}{" "}
          <span className="text-clay">{result.score.overall}</span>
          <span className="text-2xl text-muted">/100</span>
        </h1>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Left: image + analysis */}
        <div className="space-y-6">
          {imageDataUrl && (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line bg-white">
              <Image
                src={imageDataUrl}
                alt="Your outfit"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}
          <AnalysisCard analysis={analysis} />
        </div>

        {/* Right: scores + assistant + recs */}
        <div className="space-y-6">
          {/* Scores */}
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-ink">Outfit score</h3>
            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
              <ScoreRing
                primary
                value={result.score.overall}
                label="Overall"
                accent={persona.color}
              />
              <div className="flex gap-6">
                <ScoreRing
                  value={result.score.styleMatch}
                  label="Style match"
                  size={104}
                  accent="#8a8780"
                />
                <ScoreRing
                  value={result.score.colorHarmony}
                  label="Color harmony"
                  size={104}
                  accent="#8a8780"
                />
              </div>
            </div>

            {/* Score breakdown */}
            {result.score.breakdown.map((b) => (
              <div key={b.label} className="mt-4 rounded-xl bg-sand/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{b.label}</span>
                  <span className="text-sm font-bold text-clay">{b.score}</span>
                </div>
                <p className="mt-1 text-xs text-muted">{b.explanation}</p>
              </div>
            ))}
          </div>

          <AssistantMessage message={result.assistantMessage} />
          <RecommendationList recommendations={result.recommendations} assistant={result.assistantMessage.assistant} />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/upload"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-cream transition-colors hover:bg-clay"
        >
          <Sparkles className="h-4 w-4" />
          Analyze another
        </Link>
        <Link
          href="/history"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-6 text-sm font-semibold text-ink transition-colors hover:border-clay hover:text-clay"
        >
          View style memory
        </Link>
      </div>
    </div>
  );
}
