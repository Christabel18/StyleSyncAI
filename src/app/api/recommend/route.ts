/** POST /api/recommend
 *  Takes outfit analysis (tags + colors) and returns:
 *  - Style score (rule-based, fast)
 *  - Recommendations (rule-based + AI-enhanced)
 *  - Assistant message (Azure OpenAI)
 *
 *  Rule layer runs first (instant), AI layer adds personality.
 *  If AI fails, fallback recommendations + message are used.
 */

import { NextRequest, NextResponse } from "next/server";
import { calculateScore, fallbackRec } from "@/lib/scoring";
import { getSystemPrompt, buildUserMessage, getAssistantTone, getFallbackMessage } from "@/lib/prompts";
import type { RecommendRequest, RecommendResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RecommendRequest & { styleSignals?: string[] };
    const { tags, colors, userStyle, assistant, styleSignals } = body;

    if (!tags || !colors || !userStyle || !assistant) {
      return NextResponse.json(
        { error: "Missing required fields: tags, colors, userStyle, assistant" },
        { status: 400 }
      );
    }

    // ── Step 1: Rule-based scoring (instant) ──
    const score = calculateScore(tags, colors, userStyle, styleSignals);

    // ── Step 2: Rule-based recommendations (instant) ──
    const ruleRecs = fallbackRec(tags, colors, userStyle);

    // ── Step 3: AI assistant message (Azure OpenAI) ──
    let assistantMessage = {
      assistant,
      message: getFallbackMessage(assistant, score.overall, userStyle),
      tone: getAssistantTone(assistant),
    };

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";

    if (endpoint && apiKey) {
      try {
        const tagNames = tags.map((t) => t.name);
        const colorNames = colors.map((c) => c.name);
        const userMessage = buildUserMessage(tagNames, colorNames, score.overall, userStyle);

        const res = await fetch(
          `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-06-01`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": apiKey,
            },
            body: JSON.stringify({
              messages: [
                { role: "system", content: getSystemPrompt(assistant) },
                { role: "user", content: userMessage },
              ],
              max_tokens: 120,
              temperature: 0.8,
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const aiMessage = data.choices?.[0]?.message?.content;
          if (aiMessage) {
            assistantMessage = {
              assistant,
              message: aiMessage,
              tone: getAssistantTone(assistant),
            };
          }
        }
      } catch {
        // AI failed — fallback message is already set
        console.warn("Azure OpenAI call failed, using fallback message");
      }
    }

    // ── Step 4: Return combined response ──
    const response: RecommendResponse = {
      score,
      recommendations: ruleRecs,
      assistantMessage,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
