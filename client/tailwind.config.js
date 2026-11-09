/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Major Color 1: Midnight Violet (Deep, Velvet, Luxury Dark)
        navy: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#94a3b8',
          400: '#64748b',
          500: '#4c377d',
          600: '#3b2c63',
          700: '#2e224e',
          800: '#2a1f4b',
          900: '#21183B',
          950: '#21183B', // Midnight Violet (#21183B)
        },
        // Major Color 2: Deep Electric Lavender / Royal Violet (Biotech & Precision Care)
        // 100% distinct from Arogga's Teal and DocTime's Blue
        lavender: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed', // Core Deep Electric Lavender
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Backward compatibility mappings
        cobalt: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        teal: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Wired Accent Color: Electric Heartbeat Red / Life-Pulse
        pulse: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          electric: '#ff1753', // Ultra-Vivid Life-Pulse Heartbeat Red
        }
      }
    },
  },
  plugins: [],
}
