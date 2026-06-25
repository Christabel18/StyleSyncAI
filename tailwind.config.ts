import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: "#f8f6f1",
        sand: "#efeae1",
        clay: { DEFAULT: "#b45f45", dark: "#9a4f38", soft: "#f0e1da" },
        ink: { DEFAULT: "#1b1a17", soft: "#4a4842" },
        muted: "#8a8780",
        line: "#e4ddd1",
        nova: "#5b61e8",
        ava: "#7c8a72",
        ivy: "#2f5e4e",
        // Gen-Z pops
        pop: {
          purple: "#9b5de5",
          pink: "#f15bb5",
          yellow: "#fee440",
          cyan: "#00bbf9",
          green: "#00f5d4",
        },
      },
      keyframes: {
        wiggle: { "0%,100%": { transform: "rotate(-3deg)" }, "50%": { transform: "rotate(3deg)" } },
        "bounce-slow": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        wiggle: "wiggle 0.5s ease-in-out",
        "bounce-slow": "bounce-slow 2s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-up": "fade-up 0.5s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
