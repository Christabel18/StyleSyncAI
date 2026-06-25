"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import type { StyleVibe } from "@/types";
import { QUIZ, scoreVibes } from "@/lib/vibeQuiz";
import { getStyleMeta, PERSONAS, STYLE_TO_PERSONA } from "@/lib/styleConfig";
import { AVATARS } from "@/components/PersonaAvatars";

interface StyleQuizProps {
  onComplete: (style: StyleVibe) => void;
  onBack: () => void;
}

export function StyleQuiz({ onComplete, onBack }: StyleQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [phase, setPhase] = useState<"quiz" | "reveal">("quiz");
  const [result, setResult] = useState<StyleVibe | null>(null);

  const question = QUIZ[currentQ];
  const totalQ = QUIZ.length;
  const progress = ((currentQ) / totalQ) * 100;
  const currentSelections = selected[question.id] ?? new Set<string>();

  function toggleCard(cardId: string) {
    setSelected((prev) => {
      const current = new Set(prev[question.id] ?? []);
      if (current.has(cardId)) current.delete(cardId);
      else current.add(cardId);
      return { ...prev, [question.id]: current };
    });
  }

  function handleNext() {
    if (currentQ < totalQ - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      // All questions done — calculate result
      const allSelected = Object.values(selected).flatMap((s) => Array.from(s));
      const topStyle = scoreVibes(allSelected);
      setResult(topStyle);
      setPhase("reveal");
    }
  }

  function handleBack() {
    if (currentQ > 0) setCurrentQ((q) => q - 1);
    else onBack();
  }

  function handleRetake() {
    setCurrentQ(0);
    setSelected({});
    setPhase("quiz");
    setResult(null);
  }

  if (phase === "reveal" && result) {
    return <RevealScreen result={result} onAccept={onComplete} onRetake={handleRetake} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted mb-2">
          <span>Question {currentQ + 1} of {totalQ}</span>
          <span>{Math.round(progress)}% done</span>
        </div>
        <div className="h-2 w-full rounded-full bg-sand overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #9b5de5, #f15bb5, #fee440)",
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-2">
        <h2 className="text-2xl font-semibold text-ink">{question.question}</h2>
        <p className="mt-1 text-base text-muted">{question.hint}</p>
      </div>

      {/* Cards — 2×2 grid */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {question.cards.map((card) => {
          const isSelected = currentSelections.has(card.id);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => toggleCard(card.id)}
              className="relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                backgroundImage: `linear-gradient(135deg, ${card.gradient[0]}, ${card.gradient[1]})`,
                outline: isSelected ? "3px solid white" : "3px solid transparent",
                boxShadow: isSelected
                  ? `0 0 0 4px ${card.gradient[0]}, 0 8px 24px ${card.gradient[0]}60`
                  : undefined,
              }}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm text-sm font-bold text-ink">
                  ✓
                </span>
              )}

              <span className="text-3xl">{card.emoji}</span>
              <p className="mt-2 text-base font-semibold text-white leading-tight">
                {card.label}
              </p>
              <p className="mt-0.5 text-sm text-white/90">{card.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay"
        >
          {currentQ < totalQ - 1 ? (
            <>Next <ArrowRight className="h-4 w-4" /></>
          ) : (
            <>See my result ✦</>
          )}
        </button>
      </div>

      {/* Skip question */}
      <p className="mt-3 text-center text-xs text-muted">
        Not feeling any of these?{" "}
        <button
          type="button"
          onClick={handleNext}
          className="underline hover:text-clay"
        >
          skip question
        </button>
      </p>
    </div>
  );
}

// ── Reveal screen ─────────────────────────────────────────────────────────────

function RevealScreen({
  result,
  onAccept,
  onRetake,
}: {
  result: StyleVibe;
  onAccept: (style: StyleVibe) => void;
  onRetake: () => void;
}) {
  const style = getStyleMeta(result);
  const personaName = STYLE_TO_PERSONA[result];
  const persona = PERSONAS[personaName];
  const AvatarComponent = AVATARS[personaName];

  return (
    <div className="mx-auto max-w-sm text-center">
      {/* Confetti-ish gradient ring */}
      <div
        className="mx-auto flex h-32 w-32 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(from 0deg, #9b5de5, #f15bb5, #fee440, #00bbf9, #00f5d4, #9b5de5)`,
          padding: "4px",
        }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-cream">
          <span className="text-5xl">{style.emoji}</span>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium uppercase tracking-widest text-muted">
          Your style is
        </p>
        <h2 className="mt-1 text-4xl font-semibold text-ink">{style.name}</h2>
        <p className="mt-2 text-base text-ink-soft">{style.tagline}</p>
      </div>

      {/* Assigned stylist */}
      <div
        className="mt-6 flex items-center gap-3 rounded-2xl p-4"
        style={{ background: persona.bg }}
      >
        <div className="overflow-hidden rounded-full" style={{ boxShadow: `0 0 0 3px ${persona.color}` }}>
          <AvatarComponent size={52} />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-ink">
            Meet {persona.name}, your stylist
          </p>
          <p className="text-xs text-muted">{persona.blurb}</p>
        </div>
      </div>

      <p className="mt-4 px-4 text-sm leading-relaxed text-ink-soft">
        {style.description}
      </p>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => onAccept(result)}
          className="btn-shimmer inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-base font-semibold transition-transform hover:scale-105"
        >
          This is me — let&apos;s go! <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-clay hover:text-clay"
        >
          <RotateCcw className="h-4 w-4" />
          Retake the quiz
        </button>
      </div>
    </div>
  );
}
