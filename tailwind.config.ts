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
        saffron: {
          400: "#FFB347",
          500: "#FF9933",
          600: "#E67E22", // Premium Saffron
        },
        gold: {
          400: "#F1C40F",
          500: "#D4AF37", // Metallic Gold
          600: "#B8860B",
        },
        charcoal: {
          800: "#2C3E50",
          900: "#1A252F",
          950: "#0F161E", // Deep Charcoal
        },
        royal: {
          800: "#1E2761",
          900: "#101436", // Deep Royal Blue
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-lato)", "sans-serif"],
      },
      backgroundImage: {
        'mandala-pattern': "url('/patterns/mandala-opacity.png')", // Placeholder for now, will use CSS gradient
      }
    },
  },
  plugins: [],
};
export default config;
