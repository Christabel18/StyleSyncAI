/** AI Fashion Assistant system prompts — P2 owns this.
 *  Local stub — the real file lives in src/lib/prompts.ts on the team's repo.
 */
import type { AssistantName, StyleVibe } from "@/types";

export function getFallbackMessage(assistant: AssistantName, score: number, userStyle: StyleVibe): string {
  if (assistant === "Nova") {
    if (score >= 75) return `Love this look! You're totally nailing the ${userStyle} vibe. The color coordination is *chef's kiss*. Maybe try adding a statement accessory to take it to the next level! 💫`;
    if (score >= 50) return `You've got a solid foundation here! A few tweaks could really bring out that ${userStyle} energy. Try swapping one piece for something more aligned with the aesthetic. You've got this! ✨`;
    return `I see what you're going for! Let's work together to bring more ${userStyle} into this outfit. Start with your top or shoes — one swap can change everything. I believe in your style journey! 💪`;
  }
  if (assistant === "Ava") {
    if (score >= 75) return `Okay, this is giving. The ${userStyle} energy is strong. But let's push it further — add something unexpected. A bold lip color or an oversized accessory would make this editorial-worthy.`;
    if (score >= 50) return `You're halfway there, but we need more conviction. Pick your strongest piece and build around it. ${userStyle} is all about commitment — don't play it safe.`;
    return `Real talk — this needs a direction. Choose: are we doing ${userStyle} or not? Pick ONE anchor piece that screams your vibe and rebuild from there. Fashion is about intention.`;
  }
  if (score >= 75) return `Strong execution. Your color palette shows good tonal awareness, and the silhouette aligns with ${userStyle} principles. Consider adjusting proportions for optimal visual balance.`;
  if (score >= 50) return `The foundation is sound, but the color distribution could improve. Your ${userStyle} alignment is partial. Swapping one off-style item would significantly improve coherence.`;
  return `Analysis: style coherence is below optimal. The primary issue is a mismatch between your stated ${userStyle} preference and the actual garment selection. Start with footwear — it anchors the entire outfit.`;
}

export function getAssistantTone(assistant: AssistantName): string {
  if (assistant === "Nova") return "encouraging";
  if (assistant === "Ava") return "bold";
  return "analytical";
}

export function getSystemPrompt(assistant: AssistantName): string {
  return `You are ${assistant}, an AI fashion stylist.`;
}

export function buildUserMessage(tags: string[], colors: string[], score: number, userStyle: StyleVibe): string {
  return `Analyze this outfit:\n- Items: ${tags.join(", ")}\n- Colors: ${colors.join(", ")}\n- Style score: ${score}/100\n- Style: ${userStyle}\n\nGive your fashion assessment and one specific recommendation.`;
}
