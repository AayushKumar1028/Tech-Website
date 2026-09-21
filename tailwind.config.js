/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./pages/**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        void: "#04060d",
        panel: "#080d19",
        panel2: "#0c1323",
        edge: "rgba(56,189,248,0.14)",
        neon: "#22d3ee",
        plasma: "#a855f7",
        gold: "#fbbf24",
        lime: "#a3e635",
        ink: "#dbe6f5",
        muted: "#8598bd",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: {
        wrap: "76rem",
      },
      letterSpacing: {
        wider2: "0.32em",
      },
      boxShadow: {
        neon: "0 20px 70px -34px rgba(34,211,238,0.75)",
        gold: "0 20px 70px -34px rgba(251,191,36,0.6)",
      },
    },
  },
  plugins: [],
};
