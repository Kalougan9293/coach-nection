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
        primary: {
          DEFAULT: "#1F2957",
          dark: "#15203d",
        },
        secondary: {
          DEFAULT: "#D4DC53",
          light: "#e8ec9a",
          pale: "#f5f7d4",
        },
        accent: "#003399",
        background: "#F3F0EB",
        "blue-pale": "#e8ecf5",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 14px 0 rgba(31, 41, 87, 0.08)",
        card: "0 4px 20px 0 rgba(31, 41, 87, 0.1)",
        "card-hover": "0 8px 30px 0 rgba(31, 41, 87, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
