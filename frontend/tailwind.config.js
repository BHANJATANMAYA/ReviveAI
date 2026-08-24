/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#080808",
        surface: "#111111",
        "surface-elevated": "#181818",
        "surface-card": "#131313",
        "hairline": "rgba(255, 255, 255, 0.08)",
        "hairline-bright": "rgba(255, 255, 255, 0.16)",
        razor: {
          blue: "#00baf2",
          darkblue: "#0c2340",
          navy: "#02042b"
        },
        salvage: {
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#ef4444",
          violet: "#8b5cf6"
        }
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Cabinet Grotesk"', '"Space Grotesk"', '"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'tighter-editorial': '-0.04em',
        'tight-editorial': '-0.02em',
        'wide-editorial': '0.12em',
      }
    },
  },
  plugins: [],
}
