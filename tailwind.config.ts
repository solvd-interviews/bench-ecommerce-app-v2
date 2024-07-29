import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "skeleton-fast": "skeleton 1s linear infinite",
      },
      height: {
        '480': '480px',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#00CC66",
          secondary: "#f1f5f8",
          accent: "#00ffff",
          neutral: "#808080",
          "base-100": "#ffffff",
          info: "#0000ff",
          success: "#00ff00",
          error: "#FF7070",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
