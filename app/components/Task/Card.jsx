import clsx from 'clsx'
import { NavLink } from '@remix-run/react'
import { motion } from 'framer-motion'
import { FlagIcon, HandThumbUpIcon, CheckIcon } from '@heroicons/react/24/outline'

import { TaskHeader } from '.'

const spring = {
    type: "spring",
    stiffness: 500,
    damping: 30
};

export default function ({ task, link, isActive }) {
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
            <NavLink
                to={link}
                className={clsx(
                    'relative w-full flex flex-col',
                    'outline outline-1 outline-gray-300 rounded-md',
                    'shadow-lg bg-white',
                    { 'outline-2 outline-blue-600 shadow-blue-600/50 ': isActive },
                )}
            >
                <div className='py-4 px-5'>
                    <TaskHeader
                        name={task.name}
                        category={task.category}
                        points={task.points}
                    />

                    <div className="h-10 w-full' flex flex-row justify-between items-center text-gray-400 font-normal">
                        <div className="flex felx-row items-end">
                            <FlagIcon className='w-5 h-5' strokeWidth={1.5} />
                            <p className="ml-2">
                                <span className="mr-1">{task.solves}</span>solve(s)
                            </p>
                        </div>
                        <div className="flex flex-row items-end">
                            <HandThumbUpIcon className="w-5 h-5" strokeWidth={1} />
                            <p className="ml-2">{task.likes}</p>
                        </div>
                    </div>
                </div>
                {task.isSolved
                    ? (
                        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center rounded-md bg-green-500 opacity-60'>
                            <CheckIcon className='h-16 w-16 text-green-300' strokeWidth={1} />
                        </div>
                    ) : null
                }
            </NavLink>
        </motion.div>
    )
}