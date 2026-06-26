import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  StyleVibe,
  AssistantName,
  RecommendResponse,
  AnalyzeResponse,
  OutfitRecord,
} from "@/types";

interface SessionResult {
  id: string;
  imageDataUrl: string | null;
  analysis: AnalyzeResponse;
  result: RecommendResponse;
  style: StyleVibe;
  assistant: AssistantName;
  createdAt: string;
}

interface AppState {
  // Preferences (persisted)
  selectedStyle: StyleVibe | null;
  selectedAssistant: AssistantName;
  // Current session (not persisted — resets on reload)
  isLoading: boolean;
  error: string | null;
  currentSession: SessionResult | null;
  // History (persisted)
  history: OutfitRecord[];
  // Actions
  setStyle: (style: StyleVibe) => void;
  setAssistant: (assistant: AssistantName) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  setCurrentSession: (session: SessionResult | null) => void;
  addToHistory: (record: OutfitRecord) => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedStyle: null,
      selectedAssistant: "Nova",
      isLoading: false,
      error: null,
      currentSession: null,
      history: [],

      setStyle: (style) => set({ selectedStyle: style }),
      setAssistant: (assistant) => set({ selectedAssistant: assistant }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setCurrentSession: (currentSession) => set({ currentSession }),
      addToHistory: (record) =>
        set((state) => ({
          history: [record, ...state.history].slice(0, 30),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "outfitted-v1",
      // only persist preferences + history; skip runtime state
      partialize: (state) => ({
        selectedStyle: state.selectedStyle,
        selectedAssistant: state.selectedAssistant,
        history: state.history,
      }),
    },
  ),
);

export type { SessionResult };
