/** P2 — Tag taxonomy.
 *  Classifies Azure Vision tag names into AnalyzeResponse categories,
 *  or returns null for non-fashion tags (person, indoor, posing, etc.)
 */

import type { OutfitTag } from "@/types";

const CLOTHING = new Set([
  "shirt", "t-shirt", "tee", "tshirt", "polo", "blouse", "top", "tank top", "tank", "crop top",
  "sweater", "cardigan", "hoodie", "sweatshirt", "jumper", "pullover", "turtleneck",
  "jacket", "blazer", "coat", "trench coat", "parka", "puffer", "vest", "leather jacket",
  "denim jacket", "bomber jacket", "windbreaker", "outerwear", "field jacket",
  "pants", "trousers", "jeans", "chinos", "shorts", "leggings", "joggers", "khakis",
  "black jeans", "cargo pants", "sweatpants", "slacks",
  "skirt", "miniskirt", "midi skirt", "maxi skirt",
  "dress", "gown", "sundress", "maxi dress", "midi dress", "minidress", "cocktail dress",
  "casual dress",
  "jumpsuit", "romper", "overalls", "playsuit",
  "suit", "tuxedo", "uniform",
  "swimsuit", "bikini", "swimwear",
]);

const FOOTWEAR = new Set([
  "shoes", "shoe", "footwear",
  "sneakers", "sneaker", "trainers", "running shoes", "tennis shoes",
  "boots", "boot", "ankle boots", "combat boots", "chelsea boots",
  "heels", "high heels", "stilettos", "pumps", "wedges",
  "loafers", "oxfords", "brogues", "moccasins",
  "sandals", "flip flops", "flats", "ballet flats", "espadrilles",
  "slippers", "clogs", "mules",
]);

const ACCESSORY = new Set([
  "hat", "cap", "beanie", "fedora", "baseball cap", "beret", "bucket hat", "sun hat", "headband",
  "bag", "handbag", "purse", "backpack", "tote", "tote bag", "clutch", "wallet", "crossbody bag",
  "shoulder bag", "satchel", "messenger bag", "fashion accessory",
  "belt", "tie", "bow tie", "necktie", "suspenders",
  "necklace", "pearl necklace", "choker", "pendant",
  "earrings", "studs", "hoops",
  "bracelet", "bangle", "cuff",
  "ring",
  "watch", "wristwatch",
  "jewelry", "jewellery", "chains", "chain",
  "sunglasses", "glasses", "eyewear",
  "gloves", "mittens",
  "scarf", "shawl", "wrap",
  "umbrella",
]);

const OTHER_FASHION = new Set([
  "floral pattern", "floral", "stripes", "striped", "plaid", "checkered", "polka dots",
  "leopard print", "animal print", "camo", "camouflage", "tie dye",
  "denim", "leather", "silk", "wool", "cotton", "linen", "lace", "velvet", "satin",
  "pastel", "neon", "metallic", "sequins", "embroidered",
]);

const IGNORE = new Set([
  "person", "people", "human", "man", "woman", "girl", "boy", "child", "adult", "lady", "gentleman",
  "face", "hair", "skin", "eyes", "lips", "smile", "teeth",
  "indoor", "outdoor", "wall", "floor", "ceiling", "ground", "sky", "tree", "grass", "building",
  "standing", "sitting", "posing", "smiling", "looking", "walking", "running",
  "clothing", "apparel", "outfit", "fashion", "style", "wear",
  "photo", "image", "portrait", "selfie", "picture", "snapshot",
  "background", "foreground", "mirror",
  "color", "colour",
  "young", "old", "tall", "short",
  "indoors", "outdoors",
  "text",
  // body parts (used separately for inference, not as clothing items)
  "shoulder", "waist", "neck", "arm", "leg", "hand", "foot", "chest",
  // environmental
  "car", "vehicle", "land vehicle", "sidewalk", "street", "road", "city", "way", "path",
  "pocket", // too ambiguous on its own
]);

/**
 * Style signal tags — Azure returns these at high confidence and they map
 * directly to a StyleVibe. Used in scoring.ts for a bonus.
 */
export const STYLE_SIGNAL_TAGS: Record<string, string[]> = {
  streetwear: ["street fashion", "street style", "urban", "hip hop", "sneaker"],
  edgy: ["gothic", "punk", "rock style", "dark"],
  sporty: ["athletic wear", "sportswear", "activewear", "sport"],
  classic: ["formal wear", "business attire", "office fashion"],
  bohemian: ["boho", "bohemian", "festival"],
  preppy: ["preppy", "ivy league", "collegiate"],
  business: ["business", "corporate", "professional"],
};

/**
 * Body-part exposure → inferred garment.
 * Azure often tags "waist" or "shoulder" at high confidence when those
 * areas are exposed, which implies specific garment types.
 */
export const BODY_PART_INFERENCES: Record<
  string,
  { name: string; category: OutfitTag["category"]; confidence: number }
> = {
  waist: { name: "crop top", category: "clothing", confidence: 0.72 },
  shoulder: { name: "sleeveless top", category: "clothing", confidence: 0.65 },
};

export function classifyTag(name: string): OutfitTag["category"] | null {
  const n = name.toLowerCase().trim();
  if (!n || IGNORE.has(n)) return null;
  if (CLOTHING.has(n)) return "clothing";
  if (FOOTWEAR.has(n)) return "footwear";
  if (ACCESSORY.has(n)) return "accessory";
  if (OTHER_FASHION.has(n)) return "other";

  // Multi-word tags ("leather jacket" → "jacket")
  const words = n.split(/\s+/);
  for (const word of words) {
    if (CLOTHING.has(word)) return "clothing";
    if (FOOTWEAR.has(word)) return "footwear";
    if (ACCESSORY.has(word)) return "accessory";
    if (OTHER_FASHION.has(word)) return "other";
  }
  return null;
}
