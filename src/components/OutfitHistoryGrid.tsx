import Link from "next/link";
import Image from "next/image";
import type { StyleSession } from "@/types";
import { getStyle } from "@/lib/styles";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function OutfitHistoryGrid({
  sessions,
}: {
  sessions: StyleSession[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {sessions.map((s) => {
        const style = getStyle(s.preferredStyle);
        return (
          <Link
            key={s.id}
            href={`/results?id=${s.id}`}
            className="group overflow-hidden rounded-2xl border border-line bg-card transition-all hover:border-clay/40 hover:shadow-md"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              {s.imageDataUrl ? (
                <Image
                  src={s.imageDataUrl}
                  alt={`${style.name} outfit`}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{
                    backgroundImage: `linear-gradient(150deg, ${style.swatch[0]}, ${style.swatch[2] ?? style.swatch[1]})`,
                  }}
                >
                  <span className="font-display text-3xl text-white/90">
                    {s.assistant.persona.emoji}
                  </span>
                </div>
              )}
              <span className="absolute right-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-xs font-medium text-cream backdrop-blur">
                {s.analysis.score.overall}
              </span>
            </div>
            <div className="p-3">
              <p className="font-display text-sm font-semibold text-ink">
                {style.name}
              </p>
              <p className="text-xs text-muted">{formatDate(s.createdAt)}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
