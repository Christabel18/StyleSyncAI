"use client";

import { RefreshCw } from "lucide-react";

export function LoadingState({
  message = "Analyzing your fit… 👀",
  sub = "reading colors, items & patterns",
}: {
  message?: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      {/* Pulsing gradient ring */}
      <div className="relative h-24 w-24">
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: "conic-gradient(from 0deg, #9b5de5, #f15bb5, #fee440, #00bbf9, #9b5de5)",
            animation: "spin 1.2s linear infinite",
          }}
        />
        <div className="absolute inset-1 flex items-center justify-center rounded-full bg-cream">
          <span className="text-3xl" style={{ animation: "bounce-slow 2s ease-in-out infinite" }}>✦</span>
        </div>
        <style jsx>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes bounce-slow { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        `}</style>
      </div>
      <div>
        <p className="text-xl font-black text-ink">{message}</p>
        <p className="mt-1 text-sm text-muted">{sub}</p>
      </div>
      {/* Animated dots */}
      <div className="flex gap-2">
        {["#9b5de5","#f15bb5","#00bbf9"].map((c, i) => (
          <div
            key={c}
            className="h-2 w-2 rounded-full"
            style={{
              background: c,
              animation: `bounce-slow 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
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
      <span className="text-6xl">😬</span>
      <div>
        <p className="text-xl font-black text-ink">oop, we hit a snag</p>
        <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-pop-purple"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}


