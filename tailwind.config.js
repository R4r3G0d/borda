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
    ],
    theme: {
        // colors: {
        //     // 'black': '#0c0717',
        //     // 'black':'#161719',
        //     // 'grey-100':'rgb(238, 239, 252)',
        // },
        extend: {
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
            height:{
                '8vh':'80vh',
            }
        },
    },
    plugins: [
        require('@shrutibalasa/tailwind-grid-auto-fit'),
    ],
}
