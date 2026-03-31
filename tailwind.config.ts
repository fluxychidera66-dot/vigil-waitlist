import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vigil: {
          blue: '#155DFC',
          dark: '#0F172A',
        }
      }
    },
  },
  plugins: [],
}
export default config
