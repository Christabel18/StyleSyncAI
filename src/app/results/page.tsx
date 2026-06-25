"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, Clock } from "lucide-react";
import type { StyleSession } from "@/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ScoreRing";
import { AnalysisCard } from "@/components/AnalysisCard";
import { AssistantMessage } from "@/components/AssistantMessage";
import { RecommendationList } from "@/components/RecommendationList";
import { LoadingState } from "@/components/StateViews";
import { getSession, latestSession } from "@/lib/styleMemory";
import { getStyle } from "@/lib/styles";

function EmptyResults() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-md rounded-3xl border border-line bg-card p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clay-soft text-clay">
          <Sparkles className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-ink">
          No analysis yet
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Upload an outfit and your stylist will break it down here.
        </p>
        <Button href="/upload" className="mt-6">
          Analyze an outfit
        </Button>
      </div>
    </Container>
  );
}

function ResultsInner() {
  const params = useSearchParams();
  const id = params.get("id");
  const [session, setSession] = useState<StyleSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const found = (id ? getSession(id) : latestSession()) ?? null;
    setSession(found);
    setReady(true);
  }, [id]);

  if (!ready) {
    return (
      <Container className="py-12">
        <LoadingState message="Loading your report…" sub="One moment" />
      </Container>
    );
  }

  if (!session) return <EmptyResults />;

  const { analysis, recommendations, assistant } = session;
  const style = getStyle(session.preferredStyle);
  const date = new Date(session.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex items-center justify-between">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-clay"
        >
          <ArrowLeft className="h-4 w-4" />
          Style memory
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <Clock className="h-3.5 w-3.5" />
          {date}
        </span>
      </div>

      <div className="mt-4">
        <span className="text-xs uppercase tracking-widest text-clay">
          Your style report
        </span>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {style.name} — {analysis.score.overall}
          <span className="text-2xl text-muted">/100</span>
        </h1>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Left: image + analysis */}
        <div className="space-y-6">
          {session.imageDataUrl && (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line bg-card">
              <Image
                src={session.imageDataUrl}
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
          <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
            <h3 className="font-display text-xl text-ink">Outfit score</h3>
            <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
              <ScoreRing primary value={analysis.score.overall} label="Overall" />
              <div className="flex gap-6">
                <ScoreRing
                  value={analysis.score.styleMatch}
                  label="Style match"
                  size={104}
                />
                <ScoreRing
                  value={analysis.score.colorHarmony}
                  label="Color harmony"
                  size={104}
                />
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink-soft">
              {analysis.summary}
            </p>
          </div>

          <AssistantMessage message={assistant} />
          <RecommendationList result={recommendations} />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button href="/upload">
          <Sparkles className="h-4 w-4" />
          Analyze another
        </Button>
        <Button href="/history" variant="outline">
          View style memory
        </Button>
      </div>
    </Container>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-12">
          <LoadingState message="Loading your report…" sub="One moment" />
        </Container>
      }
    >
      <ResultsInner />
    </Suspense>
  );
}
