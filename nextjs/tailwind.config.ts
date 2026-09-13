import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "Arial", "sans-serif"],
        display: ["var(--font-sora)", "Arial", "sans-serif"],
        arabic: ["var(--font-arabic)", "Arial", "sans-serif"],
         mono: ["var(--font-mono)", "monospace"],
      },

      // fontFamily: {
      // mono: ["var(--font-mono)", "monospace"],
      // },

      colors: {
        ink: "#07111f",
        "ink-2": "#0b1830",
        surface: "#f5f7fa",
        line: "#dfe6ee",
        muted: "#66748a",
        teal: "#31d2b5",
        "teal-deep": "#0ca68e",
        blue: "#5d8cff",
        violet: "#8b72ff",
      },
      boxShadow: {
        soft: "0 24px 70px rgba(7,17,31,.10)",
        card: "0 20px 55px rgba(7,17,31,.07)",
        glow: "0 0 38px rgba(72,114,255,.35), 0 0 110px rgba(27,204,182,.16)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        stars: { to: { transform: "translate3d(-220px,120px,0)" } },
        nebula: { from: { transform: "translate3d(-2%,1%,0) scale(1)" }, to: { transform: "translate3d(3%,-2%,0) scale(1.08)" } },
        shoot: {
          "0%,72%": { opacity: "0", transform: "translate3d(0,0,0) rotate(-27deg)" },
          "75%": { opacity: "1" },
          "86%,100%": { opacity: "0", transform: "translate3d(-500px,260px,0) rotate(-27deg)" },
        },
        orbit: { to: { transform: "rotate(360deg)" } },
        orbitTilt: { from: { transform: "rotate(27deg)" }, to: { transform: "rotate(387deg)" } },
        orbitTall: { from: { transform: "rotate(-38deg)" }, to: { transform: "rotate(322deg)" } },
        planetFloat: { "0%,100%": { transform: "translateY(-5px) rotate(-2deg)" }, "50%": { transform: "translateY(11px) rotate(1.5deg)" } },
        halo: { "50%": { transform: "scale(1.08)", opacity: ".72" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        blink: { "0%,50%": { opacity: "1" }, "51%,100%": { opacity: "0" } },
        pulseGlow: { "50%": { opacity: ".45", boxShadow: "0 0 0 8px rgba(85,225,199,.03),0 0 24px rgba(85,225,199,.45)" } },
        progress: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        stars: "stars 26s linear infinite",
        "stars-slow": "stars 44s linear infinite reverse",
        nebula: "nebula 14s ease-in-out infinite alternate",
        shoot: "shoot 8s ease-in-out infinite 2.3s",
        orbit: "orbit 24s linear infinite",
        "orbit-tilt": "orbitTilt 31s linear infinite reverse",
        "orbit-tall": "orbitTall 27s linear infinite",
        planet: "planetFloat 7s ease-in-out infinite",
        halo: "halo 6s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
        blink: "blink .8s steps(1) infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        progress: "progress 4.2s linear 1",
      },
    },
  },
  plugins: [],
};

export default config;
