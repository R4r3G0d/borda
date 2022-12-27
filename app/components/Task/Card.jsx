import clsx from 'clsx'
import { NavLink } from '@remix-run/react'
import { motion } from 'framer-motion'
import { FlagIcon, HandThumbUpIcon, CheckIcon } from '@heroicons/react/24/outline'

import { TaskHeader } from '.'
// import { TaskColors } from './Colors'

const spring = {
    type: "spring",
    stiffness: 500,
    damping: 30
};

export const TaskColors = new Map([
    ["WEB", "from-yellow-500 to-orange-600"],
    ["CRYPTO", "from-emerald-500 to-lime-600"],
    ["FORENSICS", "from-fuchsia-500 to-purple-600"],
    ["OSINT", "from-sky-500 to-blue-600"],
    ["REVERSE", "rose"],
    ["BINARY", "from-red-500 to-rose-600"],
    ["OTHER", "from-stone-500 to-gray-600"],
    ["MISC", "from-violet-500 to-indigo-600"],
    ["STEGO", ""]
])

export default function ({ task, link, isActive }) {
    const color = TaskColors.get(task.category)
    const icon = Array.from(task.category)[0];

    return (
        <motion.div
            layout
            animate={{
                scale: [1, 1.1, 1.1, 1, 1],
                borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                border: {}
            }}
            transition={spring}
        >
            <div className={clsx(
                'w-full rounded-xl transition-transform ease-in-out',
                // { 'scale-105': isActive },
                'active:scale-95',
                { 'shadow-lg shadow-blue-500 ': isActive },

            )}>
                <NavLink to={link}
                    className={clsx(
                        'w-full py-4 px-5 grid grid-flow-row gap-2',
                        'rounded-xl border-2 border-white border-opacity-25 bg-neutral-900',

                        // 'overflow-clip',
                        // { 'border-opacity-90 bg-opacity-0': isActive },
                    )}
                >


                    <div className='relative flex flex-row w-full'>
                        <div className={clsx(color, 'bg-gradient-to-tl rounded-xl flex-none h-20 w-20 mr-5 flex justify-center items-center')}>
                            <p className='text-3xl font-semibold text-white capitalize'>{icon}</p>
                        </div>
                        <div className="w-full flex flex-col justify-between mr-5">
                            <div className="w-full">
                                <span className="inline-block text-white font-medium align-text-top leading-4 overflow-hidden">{task.name}</span>
                                <p className="text-neutral-400 text-xs">{task.category}</p>
                            </div>
                            <p className="text-2xl font-medium leading-5">
                                {task.points}
                            </p>
                        </div>
                        {/* <TaskHeader
                            name={task.name}
                            category={task.category}
                            points={task.points}
                        /> */}
                        <div className="flex-none flex flex-col justify-between items-start text-neutral-400 font-normal">
                            <div className="flex felx-row items-end">
                                <FlagIcon className='w-5 h-5' strokeWidth={1.5} />
                                <p className="ml-2">
                                    {task.solves}
                                </p>
                            </div>
                            <div className="flex flex-row items-end">
                                <HandThumbUpIcon className="w-5 h-5" strokeWidth={1} />
                                <p className="ml-2">{task.likes}</p>
                            </div>
                        </div>
                        {/* {task.isSolved
                            ? (
                                <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center rounded-md bg-green-500 opacity-60'>
                                    <CheckIcon className='h-16 w-16 text-green-300' strokeWidth={1} />
                                </div>
                            ) : null
                        } */}
                    </div>
                </NavLink>
            </div>
        </motion.div>
    )
}