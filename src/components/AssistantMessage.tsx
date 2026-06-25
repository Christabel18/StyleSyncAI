"use client";

import { useState, useEffect, useRef } from "react";
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

// Per-assistant voice settings
const VOICE_SETTINGS: Record<string, { pitch: number; rate: number }> = {
  Nova: { pitch: 1.2, rate: 1.05 },  // upbeat, energetic
  Ava:  { pitch: 0.9, rate: 0.95 },  // bold, confident
  Ivy:  { pitch: 1.0, rate: 0.88 },  // refined, measured
};

export function AssistantMessage({ message }: { message: AssistantMessageType }) {
  const persona = PERSONAS[message.assistant];
  const AvatarComponent = AVATARS[message.assistant];
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up speech on unmount
  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  function handleSpeak() {
    if (!("speechSynthesis" in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.message);
    const settings = VOICE_SETTINGS[message.assistant] ?? { pitch: 1, rate: 1 };
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;
    utterance.volume = 1;

    // Pick a female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) => v.lang.startsWith("en") && /female|woman|girl/i.test(v.name)
    ) ?? voices.find((v) => v.lang.startsWith("en"));
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

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

        {/* Speak button */}
        {"speechSynthesis" in (typeof window !== "undefined" ? window : {}) && (
          <button
            onClick={handleSpeak}
            title={speaking ? "Stop speaking" : `Hear ${persona.name} speak`}
            className="ml-2 flex items-center gap-1.5 rounded-full border border-line/60 px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-current"
            style={{ color: speaking ? persona.color : undefined }}
            aria-label={speaking ? "Stop" : "Play voice"}
          >
            {speaking ? (
              <>
                <span className="inline-block h-2 w-2 animate-ping rounded-full" style={{ background: persona.color }} />
                Stop
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                Hear {persona.name}
              </>
            )}
          </button>
        )}
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

