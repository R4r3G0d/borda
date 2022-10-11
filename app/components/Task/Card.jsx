import clsx from 'clsx'
import { NavLink } from '@remix-run/react'
import { motion } from 'framer-motion'
import { FlagIcon, ThumbUpIcon } from '@heroicons/react/outline'

import { TaskHeader } from '.'

export default function ({ task, link, isActive }) {
    return (
        <motion.div layout animate={{
            scale: [1, 1, 0.5, 2, 1],
            // rotate: [0, 0, 270, 270, 0],
            borderRadius: ["20%", "20%", "50%", "50%", "20%"],
        }}>
            <NavLink
                to={link}
                className={clsx(
                    'flex flex-col max-h-min py-4 px-5 border border-gray-300 rounded-md bg-white',
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

                <div className="h-10 flex flex-row justify-between items-center text-gray-400 font-normal">
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