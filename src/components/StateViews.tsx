"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export function LoadingState({
  message = "Analyzing your fit…",
  sub = "Reading colors, items, and patterns",
}: {
  message?: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      {/* Spinner */}
      <div className="relative h-20 w-20">
        <span className="absolute inset-0 rounded-full border-2 border-clay/20" />
        <span
          className="absolute inset-0 rounded-full border-t-2 border-clay"
          style={{ animation: "spin 0.9s linear infinite" }}
        />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <span className="absolute inset-0 flex items-center justify-center text-xl text-clay">
          ✦
        </span>
      </div>
      <div>
        <p className="text-xl font-semibold text-ink">{message}</p>
        <p className="mt-1 text-sm text-muted">{sub}</p>
      </div>
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong while analyzing your outfit.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-soft text-clay">
        <AlertCircle className="h-7 w-7" />
      </span>
      <div>
        <p className="text-xl font-semibold text-ink">We hit a snag</p>
        <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm text-ink-soft transition-colors hover:border-clay hover:text-clay"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}
