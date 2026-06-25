import type { AnalyzeResponse } from "@/types";
import { ColorPalette } from "@/components/ColorPalette";

function TagBadge({ name, confidence, category }: { name: string; confidence: number; category: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-sand px-3 py-1 text-sm">
      <span className="capitalize text-ink">{name}</span>
      <span className="text-xs text-muted">{Math.round(confidence * 100)}%</span>
      <span className="rounded-full bg-line px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted">
        {category}
      </span>
    </span>
  );
}

export function AnalysisCard({ analysis }: { analysis: AnalyzeResponse }) {
  const clothing = analysis.tags.filter((t) => t.category === "clothing");
  const footwear = analysis.tags.filter((t) => t.category === "footwear");
  const accessories = analysis.tags.filter((t) => t.category === "accessory");

  return (
    <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-ink">What we detected</h3>

      <div className="mt-5 space-y-5">
        {clothing.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
              Clothing
            </p>
            <div className="flex flex-wrap gap-2">
              {clothing.map((t) => (
                <TagBadge key={t.name} {...t} />
              ))}
            </div>
          </div>
        )}

        {footwear.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
              Footwear
            </p>
            <div className="flex flex-wrap gap-2">
              {footwear.map((t) => (
                <TagBadge key={t.name} {...t} />
              ))}
            </div>
          </div>
        )}

        {accessories.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
              Accessories
            </p>
            <div className="flex flex-wrap gap-2">
              {accessories.map((t) => (
                <TagBadge key={t.name} {...t} />
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
            Colors detected
          </p>
          <ColorPalette colors={analysis.colors} />
        </div>
      </div>
    </div>
  );
}
