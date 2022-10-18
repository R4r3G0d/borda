import clsx from 'clsx';

function Button({ text, className, ...buttonPprops }) {
    return (
        <button
            className={clsx(
                'h-10 w-24 min-w-min flex items-center justify-center',
                'text-white capitalize bg-zinc-800 whitespace-nowrap',
                'border-2 border-zinc-500 rounded-md px-4',
                'transition-transform',
                'hover:bg-black hover:border-black-800',
                'disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:hover:bg-zinc-700 disabled:text-zinc-300',
                'active:scale-90',
                className
            )}
            {...buttonPprops}
        >
            {text ? text : 'Text'}
        </button>
    )
}

export { Button }