"use client";

import type { StyleId, StyleMemory, StyleSession } from "@/types";

/**
 * Style Memory — the project's primary differentiator.
 *
 * Persisted in localStorage so outfit history, favorite colors, and preferences
 * survive reloads and work fully without the backend. When P4's Supabase layer is
 * ready, these helpers can be swapped to read/write the `outfits` / `style_memory`
 * tables while keeping the same shape.
 */

const KEY = "stylesync.memory.v1";

const EMPTY: StyleMemory = {
  preferredStyle: undefined,
  favoriteColors: [],
  commonItems: [],
  sessions: [],
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadMemory(): StyleMemory {
  if (!isBrowser()) return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...(JSON.parse(raw) as StyleMemory) };
  } catch {
    return { ...EMPTY };
  }
}

function saveMemory(memory: StyleMemory) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(memory));
  // let other tabs / components react
  window.dispatchEvent(new CustomEvent("stylesync:memory"));
}

export function setPreferredStyle(style: StyleId) {
  const memory = loadMemory();
  memory.preferredStyle = style;
  saveMemory(memory);
}

function tally(values: string[]): string[] {
  const counts = new Map<string, number>();
  for (const v of values) {
    const key = v.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);
}

export function addSession(session: StyleSession): StyleMemory {
  const memory = loadMemory();
  memory.sessions = [session, ...memory.sessions].slice(0, 30);
  memory.preferredStyle = session.preferredStyle;

  const allColors = memory.sessions.flatMap((s) => s.analysis.colors);
  memory.favoriteColors = tally(allColors).slice(0, 6);

  const allItems = memory.sessions.flatMap((s) => {
    const i = s.analysis.items;
    return [i.top, i.bottom, i.shoes, i.outerwear, ...(i.accessories ?? [])].filter(
      Boolean,
    ) as string[];
  });
  memory.commonItems = tally(allItems).slice(0, 6);

  saveMemory(memory);
  return memory;
}

export function getSession(id: string): StyleSession | undefined {
  return loadMemory().sessions.find((s) => s.id === id);
}

export function latestSession(): StyleSession | undefined {
  return loadMemory().sessions[0];
}

export function clearMemory() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("stylesync:memory"));
}
