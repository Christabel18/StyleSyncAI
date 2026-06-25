"use client";

import { useState, useEffect } from "react";
import type { AssistantMessage as AssistantMessageType } from "@/types";
import { PERSONAS } from "@/lib/styleConfig";
import { AVATARS } from "@/components/PersonaAvatars";

interface ChatBubbleProps {
  text: string;
  color: string;
  delay?: number;
}

function ChatBubble({ text, color, delay = 0 }: ChatBubbleProps) {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="relative max-w-xs transition-all duration-300 sm:max-w-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      {/* Bubble */}
      <div
        className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-white shadow-sm"
        style={{ background: color }}
      >
        {text}
      </div>
      {/* Tail pointing left (toward avatar) */}
      <div
        className="absolute -left-2 top-3 h-0 w-0"
        style={{
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderRight: `10px solid ${color}`,
        }}
      />
    </div>
  );
}

export function AssistantMessage({ message }: { message: AssistantMessageType }) {
  const persona = PERSONAS[message.assistant];
  const AvatarComponent = AVATARS[message.assistant];

  // Split message into sentences for staggered bubbles
  const sentences = message.message
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 3);

  // If it's one long sentence, just show it as one bubble
  const bubbles = sentences.length > 1 ? sentences : [message.message];

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white">
      {/* Header bar */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ background: persona.bg }}
        role="heading"
        aria-level={3}
      >
        <div
          className="flex h-3 w-3 animate-pulse rounded-full"
          style={{ background: persona.color }}
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-ink">{persona.name}</span>
        <span className="text-xs text-muted">{persona.title}</span>
        <span className="ml-auto rounded-full border border-line/60 px-2.5 py-0.5 text-xs capitalize text-muted">
          {message.tone}
        </span>
      </div>

      {/* Chat area — aria-live so screen readers announce new bubbles */}
      <div className="p-5" aria-live="polite" aria-label={`Message from ${persona.name}: ${message.message}`}>
        <div className="flex items-end gap-4">
          {/* Bitmoji avatar */}
          <div className="shrink-0">
            <div
              className="overflow-hidden rounded-full shadow-md"
              style={{
                boxShadow: `0 0 0 3px ${persona.bg}, 0 0 0 5px ${persona.color}`,
              }}
            >
              <AvatarComponent size={72} />
            </div>
            <p className="mt-1.5 text-center text-[10px] font-semibold uppercase tracking-wider"
               style={{ color: persona.color }}>
              {persona.name}
            </p>
          </div>

          {/* Staggered chat bubbles */}
          <div className="flex flex-1 flex-col gap-2">
            {bubbles.map((text, i) => (
              <ChatBubble
                key={i}
                text={text}
                color={persona.color}
                delay={i * 400}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
