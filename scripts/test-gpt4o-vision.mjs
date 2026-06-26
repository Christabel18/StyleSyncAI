/**
 * GPT-4o Vision fashion analysis test.
 * Run: node scripts/test-gpt4o-vision.mjs <OPENAI_API_KEY>
 * 
 * Calls GPT-4o Vision with a structured fashion prompt on both test images
 * and outputs JSON matching our AnalyzeResponse schema for direct comparison
 * with Azure Vision results.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const OPENAI_KEY = process.argv[2];
const IMAGES = [
  {
    path: process.env.IMG1 || process.argv[3],
    label: "Orange crop top / black cargo pants / white sneakers",
  },
  {
    path: process.env.IMG2 || process.argv[4],
    label: "Khaki field jacket / camo pants / blue Vans / layered",
  },
];

const FASHION_PROMPT = `Analyze this outfit photo and return a JSON object with EXACTLY this structure:
{
  "tags": [
    { "name": "<specific clothing item name>", "confidence": 0.95, "category": "clothing|footwear|accessory" }
  ],
  "colors": [
    { "name": "<colour name>", "hex": "<#hex>", "dominance": 0.4 }
  ],
  "dominantColor": "<main outfit colour>",
  "caption": "<one sentence describing the full outfit>"
}

Rules:
- Be SPECIFIC: say "orange crop top" not "shirt", "cargo pants" not "trousers", "white sneakers" not "footwear"
- List EVERY visible garment, shoe, and accessory as separate tags
- Confidence = how certain you are (0.0-1.0)
- Colors = actual outfit colours only (ignore background)
- Dominance = fraction of the outfit that colour covers (must sum to ~1.0)
- Return ONLY valid JSON, no markdown, no explanation`;

async function analyzeWithGPT4o(imagePath, label) {
  if (!imagePath || !OPENAI_KEY) return null;
  
  const imageBytes = readFileSync(resolve(imagePath));
  const base64 = imageBytes.toString("base64");
  const mimeType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: FASHION_PROMPT },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}`, detail: "high" },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`GPT-4o error (${response.status}):`, err.slice(0, 300));
    return null;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  
  try {
    return JSON.parse(content);
  } catch {
    // Try extracting JSON from the response
    const match = content.match(/\{[\s\S]+\}/);
    if (match) return JSON.parse(match[0]);
    console.error("Could not parse GPT-4o response:", content.slice(0, 200));
    return null;
  }
}

if (!OPENAI_KEY) {
  console.log("Usage: node scripts/test-gpt4o-vision.mjs <OPENAI_API_KEY> [image1_path] [image2_path]");
  console.log("\nExample:");
  console.log('  node scripts/test-gpt4o-vision.mjs sk-... "C:/path/to/outfit1.png" "C:/path/to/outfit2.png"');
  console.log("\nThis script tests GPT-4o Vision against Azure Vision for fashion accuracy.");
  process.exit(0);
}

console.log("Testing GPT-4o Vision on", IMAGES.filter(i => i.path).length, "images...\n");

for (const img of IMAGES) {
  if (!img.path) continue;
  console.log(`\n=== GPT-4o VISION: ${img.label} ===`);
  const result = await analyzeWithGPT4o(img.path, img.label);
  if (result) {
    console.log(JSON.stringify(result, null, 2));
  }
}
