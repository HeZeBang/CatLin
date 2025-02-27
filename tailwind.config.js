/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        base: '20px',
      },
      animation: {
        pixelVibrate: 'pixelVibrate 0.2s infinite',
      },
      keyframes: {
        pixelVibrate: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-2px, -2px)' },
          '50%': { transform: 'translate(2px, 2px)' },
          '75%': { transform: 'translate(-2px, 2px)' },
        },
      },
    },
  },
  plugins: [],
}

