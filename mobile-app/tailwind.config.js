/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C4CF1",
          50: "#F2EFFE",
          100: "#E5DFFD",
          200: "#C9BAFB",
          300: "#AD96F8",
          400: "#8F71F5",
          500: "#6C4CF1",
          600: "#5636D6",
          700: "#4228A8",
          800: "#2F1C79",
          900: "#1C114A",
        },
        background: "#F8F9FC",
        surface: "#FFFFFF",
        border: "#E9EAF2",
        muted: "#8A8DA0",
        ink: "#1A1B25",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        critical: "#DC2626",
        info: "#3B82F6",
      },
      borderRadius: {
        card: "20px",
        pill: "999px",
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
