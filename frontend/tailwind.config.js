/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5e72e4',
          50: '#f0f2ff',
          100: '#e5e8ff',
          200: '#ced3ff',
          300: '#a7b0ff',
          400: '#7a85ff',
          500: '#5e72e4',
          600: '#4a4fd9',
          700: '#3c3fbe',
          800: '#32359a',
          900: '#2d307a',
        },
        secondary: {
          DEFAULT: '#f4f5f7',
          50: '#fafbfc',
          100: '#f4f5f7',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#8898aa',
          700: '#525f7f',
          800: '#32325d',
          900: '#212529',
        },
        success: '#2dce89',
        danger: '#f5365c',
        warning: '#fb6340',
        info: '#11cdef',
        dark: '#172b4d',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        'argon': '0 15px 35px rgba(50,50,93,.1), 0 5px 15px rgba(0,0,0,.07)',
        'argon-lg': '0 20px 40px rgba(50,50,93,.1), 0 7px 18px rgba(0,0,0,.07)',
      }
    },
  },
  plugins: [],
}