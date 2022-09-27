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
    // borderRadius: {
    //   DEFAULT: '2px',
    // },
    extend: {
      animation: {
        'spin-slow': 'spin 30s linear infinite',
      }
    },
  },
  plugins: [
    require('@shrutibalasa/tailwind-grid-auto-fit'),
  ],
}
