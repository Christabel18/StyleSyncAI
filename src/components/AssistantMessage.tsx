"use client";

import { motion } from "framer-motion";
import type { AssistantMessage as AssistantMessageType } from "@/types";

export function AssistantMessage({
  message,
}: {
  message: AssistantMessageType;
}) {
  const { persona, greeting, body, tips } = message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-3xl border border-line bg-card"
    >
      <div
        className="flex items-center gap-4 px-6 py-5"
        style={{ background: "color-mix(in srgb, " + persona.accentVar + " 10%, white)" }}
      >
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full font-display text-xl text-white shadow-sm"
          style={{ background: persona.accentVar }}
        >
          {persona.emoji}
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-ink">
            {persona.name}
          </p>
          <p className="text-xs uppercase tracking-wider text-muted">
            {persona.title}
          </p>
        </div>
      </div>

      <div className="px-6 py-5">
        <p className="font-display text-base text-ink">{greeting}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>

        <ul className="mt-4 space-y-2">
          {tips.map((tip, i) => (
            <motion.li
              key={tip}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              className="flex items-start gap-3 text-sm text-ink"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: persona.accentVar }}
              />
              {tip}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
