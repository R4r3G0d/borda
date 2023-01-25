import clsx from 'clsx'
import Colors from './TaskColors'

export default function ({ name = 'No Title', category = 'OTHER', points = 0, className }) {
    const icon = Array.from(category)[0];
    const color = Colors.get(category)

    return (
        <div className={clsx("h-10 w-full flex flex-row items-center", className)}>
            <div className={clsx(
                'flex-none h-10 w-10 font-semibold text-2xl text-white capitalize grid place-items-center',
                'bg-gradient-to-tl rounded-sm', color)}
            >
                {icon}
            </div>
            <p className="grow self-start px-3 font-medium text-sm truncate">{name}</p>
            <div className="flex-none h-10 font-medium text-2xl ">
                {points}
            </div>
        </div>
    )
}
