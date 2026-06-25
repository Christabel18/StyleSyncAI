"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Shuffle } from "lucide-react";
import type { StyleVibe } from "@/types";
import { StyleSelector } from "@/components/StyleSelector";
import { StyleQuiz } from "@/components/StyleQuiz";
import { useAppStore } from "@/store/useAppStore";
import { getStyleMeta, PERSONAS, STYLE_TO_PERSONA } from "@/lib/styleConfig";
import { AVATARS } from "@/components/PersonaAvatars";

type Mode = "choose" | "quiz";

export default function OnboardingPage() {
  const router = useRouter();
  const { selectedStyle, setStyle, setAssistant } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("choose");

  useEffect(() => setMounted(true), []);

  function handleSelect(id: StyleVibe) {
    setStyle(id);
    setAssistant(STYLE_TO_PERSONA[id]);
  }

  function handleQuizComplete(id: StyleVibe) {
    setStyle(id);
    setAssistant(STYLE_TO_PERSONA[id]);
    // Small delay so the user sees the reveal screen before navigating
    setTimeout(() => router.push("/upload"), 1400);
  }

  function handleContinue() {
    if (!selectedStyle) return;
    setAssistant(STYLE_TO_PERSONA[selectedStyle]);
    router.push("/upload");
  }

  const persona = selectedStyle
    ? PERSONAS[STYLE_TO_PERSONA[selectedStyle]]
    : null;
  const AvatarComponent = persona ? AVATARS[persona.name] : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      {/* Page header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-medium uppercase tracking-widest text-clay">
          Step 1 · Style discovery
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {mode === "quiz" ? "Find your style ✦" : "What's your aesthetic?"}
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          {mode === "quiz"
            ? "Answer 10 quick questions and we'll figure out your style DNA."
            : "Know your vibe? Pick it directly. Or let us help you figure it out."}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2 rounded-full border border-line bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setMode("choose")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              mode === "choose"
                ? "bg-ink text-cream shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            I know my style
          </button>
          <button
            type="button"
            onClick={() => setMode("quiz")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              mode === "quiz"
                ? "bg-ink text-cream shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <Shuffle className="h-4 w-4" />
            Help me find it ✨
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-10">
        {mode === "choose" ? (
          <>
            {mounted ? (
              <StyleSelector value={selectedStyle} onChange={handleSelect} />
            ) : (
              <div className="h-80 animate-pulse rounded-3xl bg-sand" />
            )}

            {/* Sticky continue bar */}
            <div className="sticky bottom-6 z-40 mt-10 flex justify-center">
              <div className="flex items-center gap-4 rounded-full border border-line bg-white/90 px-5 py-3 shadow-lg backdrop-blur">
                {persona && AvatarComponent ? (
                  <span className="flex items-center gap-2.5 text-base text-ink-soft">
                    <div className="overflow-hidden rounded-full" style={{ boxShadow: `0 0 0 2px ${persona.color}` }}>
                      <AvatarComponent size={32} />
                    </div>
                    Styling with{" "}
                    <strong className="text-ink">{persona.name}</strong>
                    <span className="text-muted">·</span>
                    <span className="text-sm font-medium text-clay">
                      {getStyleMeta(selectedStyle ?? "streetwear").name}
                    </span>
                  </span>
                ) : (
                  <span className="text-base text-muted">
                    Pick a style to continue — or{" "}
                    <button
                      type="button"
                      onClick={() => setMode("quiz")}
                      className="font-semibold text-clay underline underline-offset-2"
                    >
                      take the quiz
                    </button>
                  </span>
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
          </>
        ) : (
          <StyleQuiz
            onComplete={handleQuizComplete}
            onBack={() => setMode("choose")}
          />
        )}
      </div>
    </div>
  );
}
