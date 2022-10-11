import clsx from 'clsx'
import { NavLink } from '@remix-run/react'
import { motion } from 'framer-motion'
import { FlagIcon, ThumbUpIcon } from '@heroicons/react/outline'

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
                    'w-full flex flex-col py-4 px-5 border border-gray-300 rounded-md bg-white',
                    { 'border-blue-600 shadow-blue-600/50 ': isActive },
                    'shadow-lg'
                    // 'bg-gradient-to-r from-cyan-300 to-blue-300'
                )}
            >

                <TaskHeader
                    name={task.title}
                    category={task.category}
                    points={task.points}
                />

                <div className="h-10 w-full' flex flex-row justify-between items-center text-gray-400 font-normal">
                    <div className="flex felx-row items-end">
                        <FlagIcon className='w-5 h-5' strokeWidth={1} />
                        <p className="ml-2">
                            <span className="mr-1">{task.solves}</span>solve(s)
                        </p>
                    </div>
                    <div className="flex flex-row items-end">
                        <ThumbUpIcon className="w-5 h-5" strokeWidth={1} />
                        <p className="ml-2">{task.likes}</p>
                    </div>
                </div>

            </NavLink>
        </motion.div>
    )
}