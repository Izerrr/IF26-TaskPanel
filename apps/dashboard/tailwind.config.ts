import type { Config } from "tailwindcss";

// Steam Client UI palette — see .context/design.md
// Tokens are named so components read `bg-steam-card` instead of raw hex,
// per RULES.md #2 (strict adherence to the palette).
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steam: {
          bg: "#171a21", // Main Background
          card: "#1b2838", // Card / Container
          surface: "#2a475e", // Card Hover / Surface
          accent: "#66c0f4", // Steam Blue Accent
          text: "#c6d4df", // Primary Text
          success: "#a3e035", // Status: Done
          warning: "#feab2d", // Status: Due Soon
          alert: "#f04747", // Status: Overdue
        },
      },
      fontFamily: {
        sans: ["Motiva Sans", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      borderRadius: {
        // Steam Design Strictness (RULES.md #2): sharp/subtle borders only.
        // Avoid rounded-2xl / rounded-full anywhere in this project.
        sm: "2px",
        md: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
