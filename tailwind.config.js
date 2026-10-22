export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#0857C3', dark: '#063B82', navy: '#082B59', hover: '#06469E', light: '#EAF2FF', pale: '#F4F8FF' }, ink: '#142B4A' },
      fontFamily: { sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'], mono: ['"Space Mono"', 'ui-monospace', 'monospace'] }
    }
  },
  plugins: []
};
