import Image from "next/image";
import type { OutfitRecord } from "@/types";
import { getStyleMeta } from "@/lib/styleConfig";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function OutfitHistoryGrid({ records }: { records: OutfitRecord[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {records.map((record) => {
        const style = getStyleMeta(
          (record as OutfitRecord & { style?: string }).style as never ?? "streetwear",
        );
        return (
          <div
            key={record.id}
            className="overflow-hidden rounded-2xl border border-line bg-white transition-all hover:border-clay/40 hover:shadow-md"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand">
              {record.image_url ? (
                <Image
                  src={record.image_url}
                  alt="Outfit"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{
                    backgroundImage: `linear-gradient(150deg, ${style.swatch[0]}, ${style.swatch[2] ?? style.swatch[1]})`,
                  }}
                >
                  <span className="text-3xl text-white/90 drop-shadow">
                    {record.assistant_message ? "✦" : "◍"}
                  </span>
                </div>
              )}
              <span className="absolute right-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-xs font-bold text-cream backdrop-blur">
                {record.score}
              </span>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-ink">{style.name}</p>
              <p className="text-xs text-muted">{formatDate(record.created_at)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
