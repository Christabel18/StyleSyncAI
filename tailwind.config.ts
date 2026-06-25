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
        // StyleSync fashion palette
        cream: "#f8f6f1",
        sand: "#efeae1",
        clay: {
          DEFAULT: "#b45f45",
          dark: "#9a4f38",
          soft: "#f0e1da",
        },
        ink: {
          DEFAULT: "#1b1a17",
          soft: "#4a4842",
        },
        muted: "#8a8780",
        line: "#e4ddd1",
        // Persona accent colors
        nova: "#5b61e8",
        ava: "#7c8a72",
        ivy: "#2f5e4e",
      },
    },
  },
  plugins: [],
};

export default config;
