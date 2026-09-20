import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        foreground: "#f3f4f6",
        neon: {
          cyan: "#00f5ff",
          purple: "#9d4edd",
          emerald: "#10e599",
          amber: "#f59e0b",
          rose: "#ff007f",
          blue: "#3b82f6"
        },
        cyber: {
          dark: "#040816",
          card: "rgba(10, 16, 38, 0.75)",
          cardHover: "rgba(15, 23, 54, 0.88)",
          border: "rgba(0, 245, 255, 0.15)",
          borderGlow: "rgba(0, 245, 255, 0.4)",
          glowPurple: "rgba(157, 78, 221, 0.35)",
        }
      },
      backgroundImage: {
        'cyber-gradient': 'radial-gradient(circle at 50% 0%, rgba(0, 245, 255, 0.08) 0%, rgba(4, 8, 22, 1) 75%)',
        'orb-gradient': 'radial-gradient(circle at center, rgba(0, 245, 255, 0.25) 0%, rgba(157, 78, 221, 0.15) 50%, transparent 80%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -5px rgba(0, 245, 255, 0.4)',
        'neon-purple': '0 0 25px -5px rgba(157, 78, 221, 0.4)',
        'neon-emerald': '0 0 25px -5px rgba(16, 229, 153, 0.4)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scanline 4s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(0,245,255,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(0,245,255,0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
