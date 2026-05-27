/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a18',
          surface: '#0f0f23',
          elevated: '#14143a',
        },
        accent: {
          DEFAULT: '#7c3aed',
          light: '#a78bfa',
          dark: '#5b21b6',
        },
      },
      fontFamily: {
        en: ['Inter', 'sans-serif'],
        fa: ['Vazirmatn', 'sans-serif'],
        ar: ['Cairo', 'sans-serif'],
        zh: ['"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-delayed': 'float 9s ease-in-out 2.5s infinite',
        'float-slow': 'float 11s ease-in-out 5s infinite',
        blink: 'blink 0.75s step-end infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(28px, -28px) scale(1.04)' },
          '66%': { transform: 'translate(-18px, 18px) scale(0.96)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
