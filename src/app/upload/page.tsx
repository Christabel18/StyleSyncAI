"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Pencil } from "lucide-react";
import type { StyleId, StyleSession } from "@/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { OutfitUploader } from "@/components/OutfitUploader";
import { LoadingState, ErrorState } from "@/components/StateViews";
import { analyzeOutfit, recommend } from "@/lib/api";
import { buildAssistantMessage } from "@/lib/mockApi";
import { loadMemory, addSession } from "@/lib/styleMemory";
import { getStyle } from "@/lib/styles";

type Status = "idle" | "loading" | "error";

export default function UploadPage() {
  const router = useRouter();
  const [style, setStyle] = useState<StyleId | undefined>();
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    setStyle(loadMemory().preferredStyle);
  }, []);

  const effectiveStyle: StyleId = style ?? "casual";

  async function handleAnalyze() {
    setStatus("loading");
    try {
      const analysis = await analyzeOutfit(effectiveStyle, image ?? undefined);
      const recommendations = await recommend(effectiveStyle, analysis);
      const assistant = buildAssistantMessage(effectiveStyle, recommendations);

      const session: StyleSession = {
        id: crypto.randomUUID(),
        imageDataUrl: image ?? undefined,
        preferredStyle: effectiveStyle,
        analysis,
        recommendations,
        assistant,
        createdAt: new Date().toISOString(),
      };
      addSession(session);
      router.push(`/results?id=${session.id}`);
    } catch {
      setStatus("error");
    }
  }

  if (status === "loading") {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-md rounded-3xl border border-line bg-card">
          <LoadingState />
        </div>
      </Container>
    );
  }

  if (status === "error") {
    return (
      <Container className="py-12">
        <div className="mx-auto max-w-md rounded-3xl border border-line bg-card">
          <ErrorState
            message="We couldn't analyze that outfit. Please try again."
            onRetry={() => setStatus("idle")}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs uppercase tracking-widest text-clay">
          Step 2 · Outfit upload
        </span>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Show me your outfit
        </h1>
        <p className="mt-3 text-ink-soft">
          Upload a clear, full-length photo and I&apos;ll break down the look.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <OutfitUploader value={image} onChange={setImage} />

        <div className="space-y-6">
          {/* Style chip */}
          <div className="flex items-center justify-between rounded-2xl border border-line bg-card p-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted">
                Styling as
              </p>
              <p className="font-display text-lg font-semibold text-ink">
                {style ? getStyle(style).name : "Not set yet"}
              </p>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-clay hover:text-clay"
            >
              <Pencil className="h-3.5 w-3.5" />
              {style ? "Change" : "Set style"}
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-sand/40 p-5">
            <h3 className="font-display text-base font-semibold text-ink">
              Tips for the best read
            </h3>
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

          <Button
            onClick={handleAnalyze}
            disabled={!image}
            size="lg"
            className="w-full"
          >
            <Sparkles className="h-4 w-4" />
            Analyze my outfit
          </Button>
          {!image && (
            <p className="text-center text-sm text-muted">
              Add a photo to continue.
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
