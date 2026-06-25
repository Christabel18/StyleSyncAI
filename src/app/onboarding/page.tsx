"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { StyleVibe } from "@/types";
import { StyleSelector } from "@/components/StyleSelector";
import { useAppStore } from "@/store/useAppStore";
import { getStyleMeta, PERSONAS } from "@/lib/styleConfig";

export default function OnboardingPage() {
  const router = useRouter();
  const { selectedStyle, setStyle, setAssistant } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function handleSelect(id: StyleVibe) {
    const meta = getStyleMeta(id);
    setStyle(id);
    setAssistant(meta.assistant);
  }

  function handleContinue() {
    if (!selectedStyle) return;
    router.push("/upload");
  }

  const persona = selectedStyle
    ? PERSONAS[getStyleMeta(selectedStyle).assistant]
    : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-medium uppercase tracking-widest text-clay">
          Step 1 · Style discovery
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          What&apos;s your style?
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          Choose the aesthetic you want to lean into. Your stylist uses this to
          tailor every recommendation.
        </p>
      </div>

      <div className="mt-10">
        {mounted ? (
          <StyleSelector value={selectedStyle} onChange={handleSelect} />
        ) : (
          <div className="h-64 animate-pulse rounded-3xl bg-sand" />
        )}
      </div>

      {/* Sticky continue bar */}
      <div className="sticky bottom-6 z-40 mt-12 flex justify-center">
        <div className="flex items-center gap-4 rounded-full border border-line bg-white/90 px-5 py-3 shadow-lg backdrop-blur">
          {persona ? (
            <span className="flex items-center gap-2 text-base text-ink-soft">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-sm text-white"
                style={{ background: persona.color }}
              >
                {persona.emoji}
              </span>
              Styling with{" "}
              <strong className="text-ink">{persona.name}</strong>
            </span>
          ) : (
            <span className="text-base text-muted">Pick a style to continue</span>
          )}
          <button
            onClick={handleContinue}
            disabled={!selectedStyle}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-base font-semibold text-cream transition-colors hover:bg-clay disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
