import clsx from 'clsx'

export default function ({ name = 'No Title', category = 'OTHER', points = 0 }) {
    const icon = Array.from(category)[0];

    return (
        <div className="h-10 w-full flex flex-row">
            <div className={clsx('flex-none h-10 w-10 font-semibold text-base text-center text-white leading-10 capitalize rounded-sm',
                'bg-white bg-opacity-25 backdrop-blur-xl'
            )}>
                {icon}
            </div>
            <div className="grow ml-3 h-10">
                <p className="font-medium whitespace-nowrap text-sm">{name}</p>
                <p className="text-gray-400 text-xs">{category}</p>
            </div>
            <div className="flex-none h-10 ml-3 font-medium text-2xl ">
                {points}
            </div>
        </div>
    )
}
