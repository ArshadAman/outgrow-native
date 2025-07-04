/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Added to allow manual dark mode control
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screen/**/*.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        auth: {
          background: '#10131a',
          card: '#181c24',
          border: '#232d3f',
          primary: '#0cb9f2',
          text: '#f5f7fa',
          textMuted: '#7e8a9a',
          error: '#ff4d4f',
        }
      },
      fontSize: {
        'auth-xs': '12px',
        'auth-sm': '14px',
        'auth-base': '16px',
        'auth-md': '18px',
        'auth-lg': '20px',
        'auth-xl': '24px',
        'auth-title': '36px',
      }
    },
  },
  plugins: [],
}