/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ep: {
          blue: '#2563EB',
          'blue-hover': '#1D4ED8',
          surface: '#F4F6F9',
          line: '#E5E7EB',
          muted: '#6B7280',
          ink: '#111827',
        },
        'logos-blue': '#2563EB',
        'logos-blue-light': '#DBEAFE',
        'logos-blue-pale': '#EFF6FF',
        'logos-ink': '#111827',
      },
      fontFamily: {
        sans: ['var(--font-study-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04)',
        'card-lg': '0 4px 24px rgb(15 23 42 / 0.06)',
      },
    },
  },
  plugins: [],
};
