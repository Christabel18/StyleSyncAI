"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Pencil } from "lucide-react";
import type { StyleVibe } from "@/types";
import { OutfitUploader } from "@/components/OutfitUploader";
import { LoadingState, ErrorState } from "@/components/StateViews";
import { useAppStore } from "@/store/useAppStore";
import { analyzeOutfit, getRecommendations } from "@/lib/api";
import { getStyleMeta } from "@/lib/styleConfig";
import type { SessionResult } from "@/store/useAppStore";

type Status = "idle" | "loading" | "error";

export default function UploadPage() {
  const router = useRouter();
  const {
    selectedStyle,
    selectedAssistant,
    setCurrentSession,
    addToHistory,
  } = useAppStore();

  const [mounted, setMounted] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("We couldn't analyze that outfit. Please try again.");

  useEffect(() => setMounted(true), []);

  const effectiveStyle: StyleVibe = selectedStyle ?? "streetwear";

  async function handleAnalyze() {
    setStatus("loading");
    try {
      const analysis = await analyzeOutfit(effectiveStyle, image ?? undefined);
      const result = await getRecommendations(
        analysis,
        effectiveStyle,
        selectedAssistant,
      );

      const session: SessionResult = {
        id: crypto.randomUUID(),
        imageDataUrl: image,
        analysis,
        result,
        style: effectiveStyle,
        assistant: selectedAssistant,
        createdAt: new Date().toISOString(),
      };

      setCurrentSession(session);

      // Persist a lightweight record to history
      addToHistory({
        id: session.id,
        user_id: "local",
        image_url: image ?? undefined,
        tags: analysis.tags,
        colors: analysis.colors,
        score: result.score.overall,
        recommendations: result.recommendations,
        assistant_message: result.assistantMessage.message,
        created_at: session.createdAt,
      });

      router.push("/results");
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "We couldn't analyze that outfit. Please try again.");
      setStatus("error");
    }
  }

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-md px-5 py-12">
        <div className="rounded-3xl border border-line bg-white">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-md px-5 py-12">
        <div className="rounded-3xl border border-line bg-white">
          <ErrorState
            message={errorMessage}
            onRetry={() => setStatus("idle")}
          />
        </div>
      </div>
    );
  }

  const styleMeta = mounted ? getStyleMeta(effectiveStyle) : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium uppercase tracking-widest text-clay">
          Step 2 · Outfit upload
        </span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Show me your outfit
        </h1>
        <p className="mt-3 text-ink-soft">
          Upload a clear, full-length photo and I&apos;ll break down the look.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <OutfitUploader value={image} onChange={setImage} />

        <div className="space-y-5">
          {/* Style chip */}
          <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Styling as
              </p>
              <p className="text-lg font-semibold text-ink">
                {styleMeta?.name ?? "Not set yet"}
              </p>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-clay hover:text-clay"
            >
              <Pencil className="h-3.5 w-3.5" />
              {selectedStyle ? "Change" : "Set style"}
            </Link>
          </div>

          {/* Tips */}
          <div className="rounded-2xl border border-line bg-sand/40 p-5">
            <h3 className="font-semibold text-ink">Tips for best results</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {[
                "Use natural light and a plain background",
                "Capture the full outfit, head to toe",
                "One outfit per photo works best",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" />
            Analyze my outfit
          </button>

          {!image && (
            <p className="text-center text-sm text-muted">
              Add a photo to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
