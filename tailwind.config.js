module.exports = {
  mode: 'jit',
  content: [
    './public/**/*.html',
    './app/**/*.{js,jsx,ts,tsx,vue}',
  ],
  safelist: [
    'bg-yellow-500',
    'bg-lime-500',
    'bg-fuchsia-500',
    'bg-blue-500',
    'bg-rose-500',
    'bg-red-500',
    'bg-violet-500',
  ],
  theme: {
    extend: {
      colors: {
        'error': 'hsla(10, 50%, 50%, 0.1)',
        'error-dark': '#FF0000'
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
      },
      fontSize:{
        custom:['8px','8px'],
      }
    },
  },
  plugins: [
    require('@shrutibalasa/tailwind-grid-auto-fit'),
  ],
}
