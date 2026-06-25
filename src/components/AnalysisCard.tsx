import {
  Shirt,
  type LucideIcon,
  Footprints,
  Layers,
  Gem,
  PencilRuler,
} from "lucide-react";
import type { OutfitAnalysis } from "@/types";
import { ColorPalette } from "@/components/ColorPalette";

function ItemRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand text-ink-soft">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted">{label}</p>
        <p className="truncate text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

export function AnalysisCard({ analysis }: { analysis: OutfitAnalysis }) {
  const { items, colors, patterns, styleTags } = analysis;
  const accessories = items.accessories?.filter(Boolean) ?? [];

  return (
    <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
      <h3 className="font-display text-xl text-ink">What we detected</h3>

      <div className="mt-2 divide-y divide-line">
        <ItemRow icon={Shirt} label="Top" value={items.top} />
        <ItemRow icon={Layers} label="Outerwear" value={items.outerwear} />
        <ItemRow icon={PencilRuler} label="Bottom" value={items.bottom} />
        <ItemRow icon={Footprints} label="Shoes" value={items.shoes} />
        {accessories.length > 0 && (
          <ItemRow icon={Gem} label="Accessories" value={accessories.join(", ")} />
        )}
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wider text-muted">
            Colors
          </p>
          <ColorPalette colors={colors} />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted">
              Patterns
            </p>
            <div className="flex flex-wrap gap-2">
              {patterns.length ? (
                patterns.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-sand px-3 py-1 text-sm capitalize text-ink-soft"
                  >
                    {p}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted">—</span>
              )}
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted">
              Style tags
            </p>
            <div className="flex flex-wrap gap-2">
              {styleTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-clay/30 bg-clay-soft px-3 py-1 text-sm capitalize text-clay-dark"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
