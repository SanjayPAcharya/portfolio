/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['"Plus Jakarta Sans"', 'ui-sans-serif'],
      },
      colors: {
        'gz-purple': '#8B5CF6',
        'gz-pink': '#EC4899',
        'gz-cyan': '#22D3EE',
        'gz-violet': '#7C3AED',
        'gz-bg': '#08080F',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out 1s infinite',
        'float-fast': 'float 4s ease-in-out 0.5s infinite',
        blob: 'blob 10s infinite',
        'blob-2': 'blob 13s 3s infinite',
        'blob-3': 'blob 11s 6s infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'spin-slow': 'spin 25s linear infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(40px, -60px) scale(1.15)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.85)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
