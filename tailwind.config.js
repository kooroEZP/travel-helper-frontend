/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1677ff',
        accent: '#722ed1',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 避免与 Ant Design 冲突
  },
}
