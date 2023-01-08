module.exports = {
    mode: process.env.NODE_ENV ? 'jit' : undefined,
    darkMode: 'class',
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
        'from-yellow-500',
        'from-emerald-500',
        'from-fuchsia-500',
        'from-sky-500',
        'from-red-500',
        'from-stone-500',
        'from-violet-500',
        'to-orange-600',
        'to-lime-600',
        'to-purple-600',
        'bg-gradient-to-tl',
        'to-blue-600',
        'to-rose-600',
        'to-gray-600',
        'to-indigo-600',

    ],
    theme: {
        // colors: {
        //     // 'black': '#0c0717',
        //     // 'black':'#161719',
        //     // 'grey-100':'rgb(238, 239, 252)',
        // },
        extend: {
            minWidth: {
                'xs': '320px',
            },
            backgroundImage: {
                'pixel-man': "url('/images/pixel-man.jpg')",
            },
            willChange: {
                'transform-opacity': 'transform, opacity',
            },
            colors: {
                'grey2': 'rgb(238, 239, 252)',
                'error': 'hsla(10, 50%, 50%, 0.1)',
                'error-dark': '#FF0000'
            },
            animation: {
                'spin-slow': 'spin 30s linear infinite',
            },
            fontSize: {
                custom: ['8px', '8px'],
            },
            height: {
                '8vh': '80vh',
                'sh': 'calc(100vh - 56px)',
                '600': '600px',
            },
            maxHeight: {
                'sh': 'calc(100vh - 56px)',
                '2vh': '200vh',
                '800': '800px'
            },
            minHeight: {
                '600': '600px',
            },
        },
    },
    plugins: [
        require('@shrutibalasa/tailwind-grid-auto-fit'),
        require("tailwindcss-inner-border"),
    ],
}
