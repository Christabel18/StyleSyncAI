import type { AssistantName } from "@/types";

interface AvatarProps {
  size?: number;
  className?: string;
}

/**
 * Chibi/kawaii-style SVG avatars.
 * Key style rules (matching the reference images):
 *  - Oversized round head filling most of the frame
 *  - Tiny body/outfit peeking at the bottom only
 *  - Eyes sit in the LOWER half of the face
 *  - Large, prominent rosy-pink cheek circles
 *  - Minimal features: dot eyes, tiny nose, small curved smile
 *  - Warm thick outlines (dark brown stroke)
 *  - Cute floating accents (hearts, stars)
 */

// ─── shared tiny star shape ───────────────────────────────────────────────────
function TinyStar({ x, y, r = 5, fill = "#fee440" }: { x: number; y: number; r?: number; fill?: string }) {
  const pts = [0, 1, 2, 3, 4]
    .map((i) => {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const b = a + (2 * Math.PI) / 10;
      const ir = r * 0.42;
      return `${x + r * Math.cos(a)},${y + r * Math.sin(a)} ${x + ir * Math.cos(b)},${y + ir * Math.sin(b)}`;
    })
    .join(" ");
  return <polygon points={pts} fill={fill} />;
}

// ─── Nova ─────────────────────────────────────────────────────────────────────
/** Nova — Streetwear stylist. Deep warm skin, big natural poofy hair, indigo hoodie. */
export function NovaAvatar({ size = 80, className = "" }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Floating ♡ */}
      <ellipse cx="10" cy="15" rx="4" ry="3.5" fill="#f15bb5" opacity="0.9"/>
      <path d="M10 19 L13 15.5 L10 13 L7 15.5 Z" fill="#f15bb5" opacity="0.9"/>

      {/* Big poofy natural hair — back layer */}
      <ellipse cx="40" cy="26" rx="27" ry="23" fill="#1a0a00"/>
      <ellipse cx="14" cy="36" rx="12" ry="15" fill="#1a0a00"/>
      <ellipse cx="66" cy="36" rx="12" ry="15" fill="#1a0a00"/>
      <ellipse cx="40" cy="12" rx="20" ry="12" fill="#1a0a00"/>

      {/* Outline for face (gives thick-border feel) */}
      <ellipse cx="40" cy="44" rx="23" ry="24" fill="#6b3a10"/>

      {/* Face */}
      <ellipse cx="40" cy="44" rx="21" ry="22" fill="#8D5524"/>

      {/* Ears */}
      <ellipse cx="19.5" cy="44" rx="5" ry="5.5" fill="#8D5524"/>
      <ellipse cx="19.5" cy="44" rx="3" ry="3.5" fill="#7a4820"/>
      <ellipse cx="60.5" cy="44" rx="5" ry="5.5" fill="#8D5524"/>
      <ellipse cx="60.5" cy="44" rx="3" ry="3.5" fill="#7a4820"/>

      {/* Eyes — big oval chibi eyes, lower half of face */}
      <ellipse cx="32.5" cy="41.5" rx="4" ry="4.5" fill="#1a0a00"/>
      <ellipse cx="47.5" cy="41.5" rx="4" ry="4.5" fill="#1a0a00"/>
      {/* Eye shine */}
      <ellipse cx="31" cy="39.5" rx="1.5" ry="1.8" fill="white"/>
      <ellipse cx="46" cy="39.5" rx="1.5" ry="1.8" fill="white"/>
      {/* Lower eye shine tiny dot */}
      <circle cx="34" cy="43" r="0.8" fill="white" opacity="0.7"/>
      <circle cx="49" cy="43" r="0.8" fill="white" opacity="0.7"/>

      {/* Rosy cheeks — large and prominent */}
      <ellipse cx="24" cy="48" rx="9" ry="6.5" fill="#e8796a" opacity="0.45"/>
      <ellipse cx="56" cy="48" rx="9" ry="6.5" fill="#e8796a" opacity="0.45"/>

      {/* Tiny dot nose */}
      <circle cx="40" cy="47" r="1.5" fill="#6b3a10" opacity="0.35"/>

      {/* Little curved smile */}
      <path d="M35 52 Q40 57 45 52" stroke="#1a0a00" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

      {/* Small teeth peek */}
      <path d="M36.5 52.5 Q40 55.5 43.5 52.5" fill="white"/>

      {/* Star hair clip */}
      <TinyStar x={58} y={20} r={5} fill="#fee440"/>

      {/* Neck */}
      <rect x="36" y="64" width="8" height="5" rx="1" fill="#8D5524"/>

      {/* Hoodie body */}
      <path d="M15 80 Q15 66 30 64 L50 64 Q65 66 65 80Z" fill="#5b61e8"/>
      {/* Hood opening */}
      <path d="M30 64 Q40 61 50 64" stroke="#4a50d4" strokeWidth="2" fill="none"/>
      {/* Hoodie pocket */}
      <rect x="34" y="71" width="12" height="8" rx="3" fill="#4a50d4"/>
    </svg>
  );
}

// ─── Ava ──────────────────────────────────────────────────────────────────────
/** Ava — Minimalist stylist. Warm medium skin, sleek dark bob, one wink, sage top. */
export function AvaAvatar({ size = 80, className = "" }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Floating sparkle dots */}
      <circle cx="13" cy="14" r="2" fill="#9b5de5" opacity="0.7"/>
      <circle cx="10" cy="20" r="1.2" fill="#9b5de5" opacity="0.5"/>
      <circle cx="17" cy="9" r="1.5" fill="#9b5de5" opacity="0.5"/>

      {/* Sleek bob hair — top */}
      <ellipse cx="40" cy="23" rx="22" ry="17" fill="#2c1a0e"/>
      {/* Left side hair (bob) */}
      <ellipse cx="20" cy="40" rx="9" ry="16" fill="#2c1a0e"/>
      {/* Right side hair (bob — slightly shorter) */}
      <ellipse cx="60" cy="39" rx="9" ry="14" fill="#2c1a0e"/>
      {/* Hair top detail / part */}
      <ellipse cx="40" cy="13" rx="14" ry="8" fill="#3d2510"/>

      {/* Face outline */}
      <ellipse cx="40" cy="44" rx="21" ry="22" fill="#9a6a30"/>

      {/* Face */}
      <ellipse cx="40" cy="44" rx="19" ry="20" fill="#C68642"/>

      {/* Ears */}
      <ellipse cx="21" cy="44" rx="4.5" ry="5" fill="#C68642"/>
      <ellipse cx="59" cy="44" rx="4.5" ry="5" fill="#C68642"/>

      {/* Left eye — WINKING (closed curve) */}
      <path d="M29.5 41 Q33 38 36.5 41" stroke="#2c1a0e" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Wink lashes */}
      <line x1="30" y1="41" x2="29" y2="43" stroke="#2c1a0e" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="33" y1="39.5" x2="33" y2="41.5" stroke="#2c1a0e" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="36" y1="41" x2="37" y2="43" stroke="#2c1a0e" strokeWidth="1.2" strokeLinecap="round"/>

      {/* Right eye — open chibi oval */}
      <ellipse cx="48" cy="41" rx="4" ry="4.5" fill="#2c1a0e"/>
      <ellipse cx="46.5" cy="39" rx="1.5" ry="1.8" fill="white"/>
      <circle cx="49.5" cy="43" r="0.8" fill="white" opacity="0.6"/>

      {/* Rosy cheeks */}
      <ellipse cx="25" cy="49" rx="8.5" ry="6" fill="#e8796a" opacity="0.4"/>
      <ellipse cx="55" cy="49" rx="8.5" ry="6" fill="#e8796a" opacity="0.4"/>

      {/* Tiny nose */}
      <circle cx="40" cy="48" r="1.2" fill="#9a6a30" opacity="0.3"/>

      {/* Gentle smile */}
      <path d="M35 53 Q40 57.5 45 53" stroke="#2c1a0e" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

      {/* Hair pin — small bow shape */}
      <ellipse cx="57" cy="25" rx="5" ry="3" fill="#7c8a72"/>
      <ellipse cx="63" cy="25" rx="5" ry="3" fill="#7c8a72"/>
      <circle cx="60" cy="25" r="2.5" fill="#5a6858"/>

      {/* Neck */}
      <rect x="36" y="63" width="8" height="5" rx="1" fill="#C68642"/>

      {/* Turtleneck / sage top */}
      <rect x="33" y="63" width="14" height="5" rx="3" fill="#7c8a72"/>
      {/* Body */}
      <path d="M17 80 Q17 67 31 65 L49 65 Q63 67 63 80Z" fill="#7c8a72"/>
      {/* Collar seam */}
      <line x1="17" y1="70" x2="63" y2="70" stroke="#6a7860" strokeWidth="1"/>
    </svg>
  );
}

// ─── Ivy ──────────────────────────────────────────────────────────────────────
/** Ivy — Old money stylist. Fair skin, plaid beret, auburn wavy hair, forest blazer. */
export function IvyAvatar({ size = 80, className = "" }: AvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>

      {/* Auburn wavy hair — sides, under beret */}
      <ellipse cx="17" cy="45" rx="10" ry="18" fill="#8B3A1A"/>
      <ellipse cx="63" cy="45" rx="10" ry="18" fill="#8B3A1A"/>
      {/* Wave detail on sides */}
      <path d="M12 38 Q15 42 12 46 Q15 50 12 54" stroke="#9B4A2A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M68 38 Q65 42 68 46 Q65 50 68 54" stroke="#9B4A2A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Beret — plaid checkered pattern */}
      {/* Beret main shape */}
      <ellipse cx="40" cy="21" rx="27" ry="14" fill="#e8d9a0"/>
      {/* Beret top dome */}
      <ellipse cx="40" cy="12" rx="16" ry="9" fill="#e8d9a0"/>
      {/* Plaid lines horizontal */}
      <line x1="15" y1="16" x2="65" y2="16" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
      <line x1="13" y1="21" x2="67" y2="21" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
      <line x1="14" y1="26" x2="66" y2="26" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
      {/* Plaid lines vertical */}
      <line x1="28" y1="8" x2="26" y2="32" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
      <line x1="40" y1="5" x2="40" y2="33" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
      <line x1="52" y1="8" x2="54" y2="32" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6"/>
      {/* Beret band at base */}
      <ellipse cx="40" cy="30" rx="23" ry="5" fill="#c9a84c" opacity="0.5"/>
      {/* Beret outline */}
      <ellipse cx="40" cy="21" rx="27" ry="14" stroke="#9a7a30" strokeWidth="1.5" fill="none"/>
      {/* Pom-pom on top */}
      <circle cx="40" cy="5" r="4" fill="#d4b85a"/>
      <circle cx="40" cy="5" r="2.5" fill="#e8d9a0"/>

      {/* Face outline */}
      <ellipse cx="40" cy="47" rx="21" ry="21" fill="#c9924a"/>

      {/* Face */}
      <ellipse cx="40" cy="47" rx="19" ry="19" fill="#F1C27D"/>

      {/* Ears */}
      <ellipse cx="21" cy="47" rx="4.5" ry="5" fill="#F1C27D"/>
      <ellipse cx="59" cy="47" rx="4.5" ry="5" fill="#F1C27D"/>
      {/* Earrings — pearl */}
      <circle cx="21" cy="51" r="2.5" fill="white" stroke="#e8d0b0" strokeWidth="0.5"/>
      <circle cx="59" cy="51" r="2.5" fill="white" stroke="#e8d0b0" strokeWidth="0.5"/>

      {/* Arched brows — analytical expression */}
      <path d="M31 40 Q34.5 37.5 38 39.5" stroke="#6B2D0A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M42 39.5 Q45.5 37.5 49 40" stroke="#6B2D0A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

      {/* Eyes — both open, slightly narrowed (analytical) */}
      <ellipse cx="34.5" cy="44" rx="4" ry="4.2" fill="#2c1a0e"/>
      <ellipse cx="45.5" cy="44" rx="4" ry="4.2" fill="#2c1a0e"/>
      <ellipse cx="33" cy="42" rx="1.5" ry="1.8" fill="white"/>
      <ellipse cx="44" cy="42" rx="1.5" ry="1.8" fill="white"/>
      <circle cx="36" cy="45.5" r="0.8" fill="white" opacity="0.6"/>
      <circle cx="47" cy="45.5" r="0.8" fill="white" opacity="0.6"/>

      {/* Rosy cheeks */}
      <ellipse cx="26" cy="51" rx="8.5" ry="6" fill="#e8796a" opacity="0.38"/>
      <ellipse cx="54" cy="51" rx="8.5" ry="6" fill="#e8796a" opacity="0.38"/>

      {/* Tiny nose */}
      <circle cx="40" cy="50" r="1.3" fill="#c9924a" opacity="0.3"/>

      {/* Composed slight smile */}
      <path d="M35.5 55 Q40 59 44.5 55" stroke="#2c1a0e" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

      {/* Star hair clip on side of beret */}
      <TinyStar x={56} y={29} r={4.5} fill="#fee440"/>

      {/* Neck */}
      <rect x="36" y="65" width="8" height="5" rx="1" fill="#F1C27D"/>

      {/* Blazer body */}
      <path d="M16 80 Q16 68 30 66 L50 66 Q64 68 64 80Z" fill="#2f5e4e"/>
      {/* Lapels */}
      <path d="M40 66 L30 66 L28 75 L40 70Z" fill="#265040"/>
      <path d="M40 66 L50 66 L52 75 L40 70Z" fill="#265040"/>
      {/* Gold button */}
      <circle cx="40" cy="75" r="2.2" fill="#d4af37"/>
    </svg>
  );
}

export const AVATARS: Record<AssistantName, (props: AvatarProps) => JSX.Element> = {
  Nova: NovaAvatar,
  Ava: AvaAvatar,
  Ivy: IvyAvatar,
};
