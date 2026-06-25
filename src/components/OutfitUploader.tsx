"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  fileToDataUrl,
  downscaleDataUrl,
  isAcceptedImage,
} from "@/lib/image";

export function OutfitUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file?: File) {
    setError(null);
    if (!file) return;
    if (!isAcceptedImage(file)) {
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    const raw = await fileToDataUrl(file);
    const small = await downscaleDataUrl(raw);
    onChange(small);
  }

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-line bg-card">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={value}
            alt="Your outfit"
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/80 text-cream backdrop-blur transition-colors hover:bg-clay"
          aria-label="Remove image"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex aspect-[4/5] w-full flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-8 text-center transition-colors",
          dragging
            ? "border-clay bg-clay-soft/50"
            : "border-line bg-card hover:border-clay/50 hover:bg-clay-soft/20",
        )}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sand text-clay">
          <UploadCloud className="h-7 w-7" />
        </span>
        <div>
          <p className="font-display text-lg text-ink">Drop your outfit here</p>
          <p className="mt-1 text-sm text-muted">
            or click to browse · JPG, PNG, WebP
          </p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="mt-3 text-sm text-clay-dark">{error}</p>}
    </div>
  );
}
