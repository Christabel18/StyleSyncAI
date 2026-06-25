"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Shuffle } from "lucide-react";
import type { StyleId } from "@/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { StyleSelector } from "@/components/StyleSelector";
import { InspirationCards } from "@/components/InspirationCards";
import { loadMemory, setPreferredStyle } from "@/lib/styleMemory";
import { getStyle } from "@/lib/styles";

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<StyleId | undefined>();
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    setSelected(loadMemory().preferredStyle);
  }, []);

  function handleContinue() {
    if (!selected) return;
    setPreferredStyle(selected);
    router.push("/upload");
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs uppercase tracking-widest text-clay">
          Step 1 · Style discovery
        </span>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          What&apos;s your style?
        </h1>
        <p className="mt-3 text-ink-soft">
          Choose the aesthetic you want to lean into. Your stylist uses this to
          tailor every recommendation.
        </p>
      </div>

      <div className="mt-10">
        <StyleSelector value={selected} onChange={setSelected} />
      </div>

      {/* Optional swipe enhancement */}
      <div className="mx-auto mt-12 max-w-xl text-center">
        <button
          type="button"
          onClick={() => setShowCards((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-clay hover:text-clay"
        >
          <Shuffle className="h-4 w-4" />
          {showCards ? "Hide the looks" : "Not sure? Swipe a few looks"}
        </button>

        {showCards && (
          <div className="mt-8">
            <InspirationCards
              onComplete={(suggested) => {
                if (suggested) setSelected(suggested);
                setShowCards(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Sticky continue bar */}
      <div className="sticky bottom-6 z-40 mt-12 flex justify-center">
        <div className="flex items-center gap-4 rounded-full border border-line bg-card/90 px-5 py-3 shadow-lg backdrop-blur">
          <span className="text-sm text-ink-soft">
            {selected ? (
              <>
                Selected:{" "}
                <span className="font-semibold text-ink">
                  {getStyle(selected).name}
                </span>
              </>
            ) : (
              "Pick a style to continue"
            )}
          </span>
          <Button onClick={handleContinue} disabled={!selected}>
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Container>
  );
}
