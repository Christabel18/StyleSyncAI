"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function OutfitUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      setError(null);
      const file = accepted[0];
      if (!file) return;
      try {
        const dataUrl = await fileToBase64(file);
        onChange(dataUrl);
      } catch {
        setError("Could not read the image. Please try another file.");
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    multiple: false,
    onDropRejected: () => setError("Please drop a JPG, PNG, or WebP image."),
  });

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-line bg-white">
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
      <div
        {...getRootProps()}
        className={cn(
          "flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-8 text-center transition-colors",
          isDragActive
            ? "border-clay bg-clay-soft/50"
            : "border-line bg-white hover:border-clay/50 hover:bg-clay-soft/20",
        )}
      >
        <input {...getInputProps()} />
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sand text-clay">
          <UploadCloud className="h-7 w-7" />
        </span>
        <div>
          <p className="text-lg font-semibold text-ink">
            {isDragActive ? "Drop it here!" : "Drop your outfit here"}
          </p>
          <p className="mt-1 text-sm text-muted">
            or click to browse · JPG, PNG, WebP
          </p>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-clay-dark">{error}</p>}
    </div>
  );
}
