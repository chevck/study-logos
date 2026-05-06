/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ep: {
          accent: '#F5B82D',
          'accent-hover': '#E0A724',
          'accent-soft': '#FFF8EA',
          'accent-muted': '#F3D893',
          'accent-foreground': '#1C1A16',
          /** Soft UI neutrals — warm gray, not clinical blue-grey */
          surface: '#EDECEA',
          'surface-muted': '#F7F7F6',
          'surface-panel': '#FEFEFE',
          line: '#E4E3E1',
          muted: '#65635F',
          ink: '#1A1917',
          glow: '#FFEAC7',
          /** Semantic green for success-style chips (Crextio “Invited” tone) */
          success: '#4CA86D',
          'success-soft': '#E8F5EC',
          /** Deprecated aliases — mapped to accent for readability in existing strings */
          blue: '#F5B82D',
          'blue-hover': '#E0A724',
        },
        logos: {
          accent: '#F5B82D',
          'accent-soft': '#FFF8EA',
          ink: '#1A1917',
        },
      },
      fontFamily: {
        sans: ['var(--font-study-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '28px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 10px 40px rgb(26 25 23 / 0.06), 0 2px 8px rgb(26 25 23 / 0.03)',
        'card-lg': '0 16px 48px rgb(26 25 23 / 0.08), 0 4px 12px rgb(26 25 23 / 0.04)',
        soft: '0 6px 24px rgb(245 184 45 / 0.12)',
        innerSoft: 'inset 0 1px 1px rgb(26 25 23 / 0.04)',
      },
    },
  },
  plugins: [],
};
