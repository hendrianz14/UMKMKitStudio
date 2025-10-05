import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: { center: true, padding: "0", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          bg: "#0B1220",
          panel: "#0F172A",
          stroke: "#1E293B",
          blue: "#3B82F6",
          blue2: "#6366F1",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(59,130,246,.35), 0 8px 40px rgba(59,130,246,.35)",
      },
    },
  },
  plugins: [],
};
export default config;
