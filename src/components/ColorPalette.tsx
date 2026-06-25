import { colorToHex, readableOn } from "@/lib/colors";

export function ColorPalette({ colors }: { colors: string[] }) {
  if (!colors.length) {
    return <p className="text-sm text-muted">No colors detected.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => {
        const hex = colorToHex(c);
        return (
          <span
            key={c}
            className="inline-flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm"
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px]"
              style={{ background: hex, color: readableOn(hex) }}
            >
              ●
            </span>
            <span className="capitalize text-ink-soft">{c}</span>
          </span>
        );
      })}
    </div>
  );
}
