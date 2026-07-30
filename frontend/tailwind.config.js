/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        card: 'var(--card)',
        border: 'var(--border)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
        alt: ['var(--font-alt)'],
      },
      animation: {
        'radar-pulse': 'radar-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slow-drift': 'slow-drift 15s linear infinite',
      },
      keyframes: {
        'radar-pulse': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: .5, transform: 'scale(1.05)' },
        },
        'slow-drift': {
          '0%': { transform: 'translate(0px, 0px)' },
          '33%': { transform: 'translate(20px, -20px)' },
          '66%': { transform: 'translate(-20px, 20px)' },
          '100%': { transform: 'translate(0px, 0px)' },
        }
      }
    },
  },
  plugins: [],
}
