/** AI Fashion Assistant system prompts */
import type { AssistantName, StyleVibe } from "@/types";

export function getFallbackMessage(assistant: AssistantName, score: number, userStyle: StyleVibe): string {
  if (assistant === "Nova") {
    if (score >= 75) return `Love this look! You are totally nailing the ${userStyle} vibe! Color coordination is on point. Maybe add a statement accessory to take it to the next level!`;
    if (score >= 50) return `Solid foundation! A few tweaks could really bring out that ${userStyle} energy. Try swapping one piece for something more aligned with the aesthetic.`;
    return `Start with your top or shoes — one swap can change everything. I believe in your style journey!`;
  }
  if (assistant === "Ava") {
    if (score >= 75) return `Okay, this is giving. The ${userStyle} energy is strong. But push it further — add something unexpected that makes this editorial-worthy.`;
    if (score >= 50) return `Halfway there, but we need more conviction. Pick your strongest piece and build around it. ${userStyle} is about commitment — don't play it safe.`;
    return `Real talk — this needs a direction. Pick ONE anchor piece that screams your vibe and rebuild from there.`;
  }
  if (score >= 75) return `Strong execution. Your color palette shows good tonal awareness and the silhouette aligns with ${userStyle} principles. Consider adjusting proportions.`;
  if (score >= 50) return `Foundation is sound but color distribution could improve. Your ${userStyle} alignment is partial. One swap would significantly improve coherence.`;
  return `Style coherence is below optimal. The primary issue is a mismatch with ${userStyle} preference. Start with footwear — it anchors the entire outfit direction.`;
}

export function getSystemPrompt(assistant: AssistantName): string {
  const prompts: Record<AssistantName, string> = {
    Nova: "You are Nova, a warm encouraging AI fashion assistant. Start with praise, be casual and friendly, suggest exactly ONE actionable improvement. Keep responses under 120 tokens.",
    Ava: "You are Ava, a bold fashion-forward AI style assistant. Be direct and confident, reference high fashion aesthetics, suggest exactly ONE bold upgrade. Keep responses under 120 tokens.",
    Ivy: "You are Ivy, a precise analytical AI style consultant. Reference color theory and style principles, suggest exactly ONE improvement with clear reasoning. Keep responses under 120 tokens.",
  };
  return prompts[assistant];
}

export function getAssistantTone(assistant: AssistantName): string {
  const tones: Record<AssistantName, string> = {
    Nova: "encouraging",
    Ava: "bold",
    Ivy: "analytical",
  };
  return tones[assistant];
}

export function buildUserMessage(tags: string[], colors: string[], score: number, userStyle: StyleVibe): string {
  return [
    "Analyze this outfit:",
    `- Items detected: ${tags.join(", ")}`,
    `- Colors: ${colors.join(", ")}`,
    `- Style score: ${score}/100`,
    `- User's preferred style: ${userStyle}`,
    "",
    "Give your fashion assessment and one specific recommendation.",
  ].join("\n");
}
