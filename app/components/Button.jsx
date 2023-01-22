import clsx from 'clsx';

function Button({ text, small, big, icon, full, className, ...buttonPprops }) {
    let medium
    if (!small && !big) { medium = true }

    const Icon = icon;

    return (
        <button
            className={clsx(
                [{ 'w-full': full }, { 'h-8': small, 'h-11': medium, ' h-14': big }],
                { 'px-4': small, 'px-6': medium, 'px-8': big },
                'rounded-md border-2 border-blue-600 border-opacity-50 ',
                'flex items-center justify-center',
                'bg-blue-600 hover:bg-blue-800 disabled:bg-blue-900',
                ['text-white disabled:text-zinc-300', {'text-sm': small, 'text-base': medium, 'text-base': big }],
                'disabled:cursor-not-allowed ',
                'active:scale-90',
                'transition-transform',
                className
            )}
            {...buttonPprops}
        >
            {icon ? (
                <div className={clsx('h-full flex items-center', { 'mr-1': small, 'mr-2': medium, 'mr-2': big })}>
                    <Icon
                        className={clsx({ 'w-4 h-4': small, 'w-5 h-5': medium, 'w-6 h-6': big })}
                        strokeWidth={1}
                    />
                </div>
            ) : null}
            <p className='h-full flex items-center whitespace-nowrap'>
                {text ? text : icon? null: "Dfeault"}
            </p>
        </button>
    )
}

export default Button