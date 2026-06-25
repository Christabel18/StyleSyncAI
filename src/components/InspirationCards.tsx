"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Heart, X } from "lucide-react";
import type { StyleId } from "@/types";
import { STYLES } from "@/lib/styles";

interface InspoCard {
  id: string;
  title: string;
  styleId: StyleId;
  from: string;
  to: string;
}

const CARDS: InspoCard[] = STYLES.map((s) => ({
  id: s.id,
  title: s.tagline,
  styleId: s.id,
  from: s.swatch[0],
  to: s.swatch[2] ?? s.swatch[1],
}));

function mostFrequent(styles: StyleId[]): StyleId | undefined {
  if (!styles.length) return undefined;
  const counts = new Map<StyleId, number>();
  for (const s of styles) counts.set(s, (counts.get(s) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function SwipeCard({
  card,
  onVote,
}: {
  card: InspoCard;
  onVote: (dir: 1 | -1) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-16, 16]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const skipOpacity = useTransform(x, [-120, -20], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > 110) onVote(1);
        else if (info.offset.x < -110) onVote(-1);
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { scale: 0.96, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: (dir: number) => ({
          x: dir * 460,
          opacity: 0,
          transition: { duration: 0.3 },
        }),
      }}
    >
      <div
        className="flex h-full w-full flex-col justify-between rounded-[2rem] p-7 text-white shadow-xl"
        style={{
          backgroundImage: `linear-gradient(150deg, ${card.from}, ${card.to})`,
        }}
      >
        <div className="flex justify-between">
          <motion.span
            style={{ opacity: skipOpacity }}
            className="rounded-full border-2 border-white/80 px-3 py-1 text-xs font-bold uppercase tracking-widest"
          >
            Skip
          </motion.span>
          <motion.span
            style={{ opacity: likeOpacity }}
            className="rounded-full border-2 border-white/80 px-3 py-1 text-xs font-bold uppercase tracking-widest"
          >
            Love
          </motion.span>
        </div>

        <div>
          <p className="font-display text-3xl font-semibold leading-tight drop-shadow-sm">
            {STYLES.find((s) => s.id === card.styleId)?.name}
          </p>
          <p className="mt-1 text-white/85">{card.title}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function InspirationCards({
  onComplete,
}: {
  onComplete: (suggested?: StyleId) => void;
}) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<StyleId[]>([]);
  const [exitDir, setExitDir] = useState(1);

  const current = CARDS[index];
  const next = CARDS[index + 1];
  const done = index >= CARDS.length;

  function vote(dir: 1 | -1) {
    if (!current) return;
    const nextLiked = dir === 1 ? [...liked, current.styleId] : liked;
    setLiked(nextLiked);
    setExitDir(dir);
    const nextIndex = index + 1;
    setIndex(nextIndex);
    if (nextIndex >= CARDS.length) {
      setTimeout(() => onComplete(mostFrequent(nextLiked)), 320);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[380px] w-full max-w-xs">
        {!done && next && (
          <div
            className="absolute inset-0 scale-95 rounded-[2rem] opacity-60"
            style={{
              backgroundImage: `linear-gradient(150deg, ${next.from}, ${next.to})`,
            }}
          />
        )}

        <AnimatePresence custom={exitDir}>
          {!done && current && (
            <SwipeCard key={current.id} card={current} onVote={vote} />
          )}
        </AnimatePresence>

        {done && (
          <div className="flex h-full items-center justify-center rounded-[2rem] border border-line bg-card text-center">
            <p className="px-6 font-display text-lg text-ink">
              Nice taste — locking it in ✦
            </p>
          </div>
        )}
      </div>

      {!done && (
        <>
          <div className="mt-6 flex items-center gap-5">
            <button
              type="button"
              onClick={() => vote(-1)}
              aria-label="Skip"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-card text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => vote(1)}
              aria-label="Love"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-clay text-white shadow-md transition-transform hover:scale-105"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 text-xs uppercase tracking-widest text-muted">
            {index + 1} of {CARDS.length} · drag or tap
          </p>
        </>
      )}
    </div>
  );
}
