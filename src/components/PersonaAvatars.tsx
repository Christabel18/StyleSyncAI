import type { AssistantName } from "@/types";

/**
 * Bitmoji-style SVG avatars for each stylist persona.
 * Each has a distinct skin tone, hair, outfit color, and expression.
 */

interface AvatarProps {
  size?: number;
  className?: string;
}

/** Nova — streetwear stylist. Dark skin, big natural hair, indigo hoodie. */
export function NovaAvatar({ size = 80, className = "" }: AvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Big natural hair */}
      <ellipse cx="40" cy="26" rx="22" ry="20" fill="#1a0a00" />
      <ellipse cx="22" cy="30" rx="8" ry="12" fill="#1a0a00" />
      <ellipse cx="58" cy="30" rx="8" ry="12" fill="#1a0a00" />
      {/* Head */}
      <ellipse cx="40" cy="32" rx="16" ry="17" fill="#8D5524" />
      {/* Ear */}
      <ellipse cx="24.5" cy="33" rx="3" ry="4" fill="#7a4820" />
      <ellipse cx="55.5" cy="33" rx="3" ry="4" fill="#7a4820" />
      {/* Eyes */}
      <ellipse cx="34" cy="30" rx="3" ry="3.5" fill="#1a0a00" />
      <ellipse cx="46" cy="30" rx="3" ry="3.5" fill="#1a0a00" />
      <ellipse cx="33.2" cy="29" rx="1" ry="1.2" fill="white" />
      <ellipse cx="45.2" cy="29" rx="1" ry="1.2" fill="white" />
      {/* Nose */}
      <ellipse cx="40" cy="36" rx="2.5" ry="1.5" fill="#7a4820" />
      {/* Smile */}
      <path d="M34 41 Q40 46 46 41" stroke="#1a0a00" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Teeth */}
      <path d="M36 41.5 Q40 44.5 44 41.5" fill="white" />
      {/* Neck */}
      <rect x="35" y="48" width="10" height="7" fill="#8D5524" />
      {/* Hoodie body */}
      <path d="M18 80 Q18 60 30 57 L50 57 Q62 60 62 80Z" fill="#5b61e8" />
      {/* Hoodie hood accent */}
      <path d="M30 57 Q40 54 50 57" stroke="#4a50d4" strokeWidth="2" fill="none" />
      {/* Hoodie pocket */}
      <rect x="33" y="68" width="14" height="8" rx="2" fill="#4a50d4" />
      {/* Star accessory on hoodie */}
      <text x="38" y="65" fontSize="8" fill="white">✦</text>
    </svg>
  );
}

/** Ava — minimalist stylist. Medium skin, sleek bun, sage turtleneck. */
export function AvaAvatar({ size = 80, className = "" }: AvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hair base */}
      <ellipse cx="40" cy="22" rx="16" ry="12" fill="#2c1a0e" />
      {/* Bun */}
      <circle cx="40" cy="13" r="7" fill="#2c1a0e" />
      {/* Bun highlight */}
      <circle cx="38" cy="11" r="2" fill="#3d2510" />
      {/* Head */}
      <ellipse cx="40" cy="33" rx="15" ry="16" fill="#C68642" />
      {/* Ears */}
      <ellipse cx="25.5" cy="33" rx="3" ry="4" fill="#b57535" />
      <ellipse cx="54.5" cy="33" rx="3" ry="4" fill="#b57535" />
      {/* Eyes — almond shaped, calm */}
      <path d="M31 30 Q34 27.5 37 30 Q34 32 31 30Z" fill="#2c1a0e" />
      <path d="M43 30 Q46 27.5 49 30 Q46 32 43 30Z" fill="#2c1a0e" />
      <circle cx="34" cy="29.5" r="0.8" fill="white" />
      <circle cx="46" cy="29.5" r="0.8" fill="white" />
      {/* Subtle lashes */}
      <line x1="31" y1="28.5" x2="30" y2="27" stroke="#2c1a0e" strokeWidth="0.8" />
      <line x1="37" y1="28.5" x2="38" y2="27" stroke="#2c1a0e" strokeWidth="0.8" />
      <line x1="43" y1="28.5" x2="42" y2="27" stroke="#2c1a0e" strokeWidth="0.8" />
      <line x1="49" y1="28.5" x2="50" y2="27" stroke="#2c1a0e" strokeWidth="0.8" />
      {/* Nose */}
      <ellipse cx="40" cy="36" rx="2" ry="1.2" fill="#b57535" />
      {/* Serene smile */}
      <path d="M36 40 Q40 43 44 40" stroke="#2c1a0e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Neck */}
      <rect x="35.5" y="48" width="9" height="7" fill="#C68642" />
      {/* Turtleneck */}
      <rect x="33" y="53" width="14" height="5" rx="2" fill="#7c8a72" />
      {/* Body */}
      <path d="M20 80 Q20 60 32 57 L48 57 Q60 60 60 80Z" fill="#7c8a72" />
      {/* Clean collar line */}
      <line x1="20" y1="62" x2="60" y2="62" stroke="#6a7860" strokeWidth="1" />
    </svg>
  );
}

/** Ivy — old money stylist. Light skin, auburn low chignon, forest blazer. */
export function IvyAvatar({ size = 80, className = "" }: AvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hair */}
      <ellipse cx="40" cy="22" rx="17" ry="13" fill="#8B3A1A" />
      {/* Chignon bun at back/low */}
      <ellipse cx="40" cy="19" rx="10" ry="6" fill="#9B4A2A" />
      {/* Side swept strands */}
      <path d="M24 28 Q22 22 26 18" stroke="#8B3A1A" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M56 28 Q58 22 54 18" stroke="#8B3A1A" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Head */}
      <ellipse cx="40" cy="33" rx="15" ry="16" fill="#F1C27D" />
      {/* Ears */}
      <ellipse cx="25.5" cy="33" rx="3" ry="3.5" fill="#e0b068" />
      <ellipse cx="54.5" cy="33" rx="3" ry="3.5" fill="#e0b068" />
      {/* Pearl earring */}
      <circle cx="25.5" cy="36.5" r="2" fill="white" stroke="#e8e0d0" strokeWidth="0.5" />
      <circle cx="54.5" cy="36.5" r="2" fill="white" stroke="#e8e0d0" strokeWidth="0.5" />
      {/* Eyes — defined, arched */}
      <ellipse cx="34" cy="30" rx="3" ry="2.8" fill="#2c1a0e" />
      <ellipse cx="46" cy="30" rx="3" ry="2.8" fill="#2c1a0e" />
      <ellipse cx="33.2" cy="29" rx="1" ry="1" fill="white" />
      <ellipse cx="45.2" cy="29" rx="1" ry="1" fill="white" />
      {/* Arched brows */}
      <path d="M31 26.5 Q34 24.5 37 26" stroke="#6B2D0A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M43 26.5 Q46 24.5 49 26" stroke="#6B2D0A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Nose */}
      <ellipse cx="40" cy="35.5" rx="1.8" ry="1.2" fill="#e0b068" />
      {/* Composed smile */}
      <path d="M36 40 Q40 43.5 44 40" stroke="#2c1a0e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Neck */}
      <rect x="36" y="48" width="8" height="7" fill="#F1C27D" />
      {/* Blazer */}
      <path d="M18 80 Q18 58 32 56 L48 56 Q62 58 62 80Z" fill="#2f5e4e" />
      {/* Lapels */}
      <path d="M40 56 L32 56 L30 68 L40 63Z" fill="#265040" />
      <path d="M40 56 L48 56 L50 68 L40 63Z" fill="#265040" />
      {/* Button */}
      <circle cx="40" cy="70" r="2" fill="#d4af37" />
      <circle cx="40" cy="63" r="1.5" fill="#d4af37" />
    </svg>
  );
}

export const AVATARS: Record<AssistantName, (props: AvatarProps) => JSX.Element> = {
  Nova: NovaAvatar,
  Ava: AvaAvatar,
  Ivy: IvyAvatar,
};
