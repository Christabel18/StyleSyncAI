import type { OutfitColor } from "@/types";

export function ColorPalette({ colors }: { colors: OutfitColor[] }) {
  if (!colors.length) {
    return <p className="text-sm text-muted">No colors detected.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => {
        return (
          <span
            key={c.name}
            className="inline-flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm"
          >
            <span
              className="h-6 w-6 rounded-full"
              style={{ background: c.hex }}
              aria-hidden
            />
            <span className="capitalize text-ink-soft">{c.name}</span>
            <span className="text-xs text-muted">
              {Math.round(c.dominance * 100)}%
            </span>
          </span>
        );
      })}
    </div>
  );
}
