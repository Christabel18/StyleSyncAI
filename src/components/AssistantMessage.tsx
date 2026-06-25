import type { AssistantMessage as AssistantMessageType } from "@/types";
import { PERSONAS } from "@/lib/styleConfig";

export function AssistantMessage({ message }: { message: AssistantMessageType }) {
  const persona = PERSONAS[message.assistant];

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white">
      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-5"
        style={{ background: persona.bg }}
      >
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full text-2xl text-white shadow-sm"
          style={{ background: persona.color }}
        >
          {persona.emoji}
        </span>
        <div>
          <p className="text-lg font-semibold text-ink">{persona.name}</p>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            {persona.title}
          </p>
        </div>
        <span className="ml-auto rounded-full border border-line/80 px-3 py-1 text-xs capitalize text-muted">
          {message.tone}
        </span>
      </div>

      {/* Message */}
      <div className="px-6 py-5">
        <p className="text-base leading-relaxed text-ink">{message.message}</p>
      </div>
    </div>
  );
}
