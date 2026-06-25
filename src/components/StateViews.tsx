"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LoadingState({
  message = "Analyzing your fit…",
  sub = "Reading colors, items, and patterns",
}: {
  message?: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="relative h-20 w-20">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-clay/30"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-2 rounded-full border-t-2 border-clay"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="absolute inset-0 flex items-center justify-center font-display text-xl text-clay">
          ✦
        </span>
      </div>
      <div>
        <p className="font-display text-xl text-ink">{message}</p>
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
        <p className="font-display text-xl text-ink">We hit a snag</p>
        <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
