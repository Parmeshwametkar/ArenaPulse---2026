/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stadium: {
          bg: '#060b13',
          card: '#0e1622',
          green: '#10b981',
          greenDark: '#047857',
          neonCyan: '#00f2fe',
          neonGreen: '#39ff14',
          accentBlue: '#1e40af',
          accentSlate: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Orbitron', 'monospace']
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 242, 254, 0.4)',
        'neon-green': '0 0 15px rgba(57, 255, 20, 0.4)',
        'neon-stadium': '0 0 20px rgba(16, 185, 129, 0.25)',
      }
    },
  },
  plugins: [],
}
