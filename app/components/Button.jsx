import clsx from 'clsx';

export default function Button({ type, name, className, disabled, onClick }) {
    return (

        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                'transition-transform',
                'break-normal text-white h-10',
                'bg-zinc-800 border-2 border-gray-500 ',
                'border rounded-md max-w-fit capitalize px-3 py-1 ',
                { 'cursor-not-allowed hover:zinc-800': disabled },
                { 'hover:bg-black hover:border-black-800 active:scale-90': !disabled },
                className
            )}
        >
            {name}
        </button>
    )
}