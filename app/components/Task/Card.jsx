import clsx from 'clsx'
import { NavLink } from '@remix-run/react'
import { motion } from 'framer-motion'
import { FlagIcon, HandThumbUpIcon, CheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { TaskColors } from './Colors'

export default function ({ task, link, isFocused }) {
    const color = TaskColors.get(task.category)
    const icon = Array.from(task.category)[0];

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
        >
            <NavLink
                to={link}
                className={({ isActive }) => clsx(
                    'w-full py-4 px-5 grid grid-flow-row gap-2 ',
                    'active:scale-95 ',
                    // { 'shadow-0 shadow-blue-500/50 ': isFocused },
                    'bg-neutral-900',
                    ['rounded-md overflow-hidden border-2 border-white/10 hover:border-white/60', { 'border-blue-600 hover:border-blue-600 ': isFocused }],
                    { 'outline outline-4 outline-blue-500/50 outline-offset-1': isFocused },
                    // { 'cursor-not-allowed': props.disabled },
                    'transition-transform ease-in-out',
                    'relative',
                    
                )}>
                <div className={clsx('w-full h-24 flex flex-row', )}>
                    <div className={clsx(color, 'bg-gradient-to-tl rounded-xl flex-none h-24 w-24 flex justify-center items-center')}>
                        <p className='break-words'>
                            <span className='text-3xl font-semibold text-white capitalize'>{icon}</span>
                            {task.category.slice(1)}
                        </p>
                    </div>

                    <div className="ml-5 grid grid-cols-2 grid-rows-2 gap-2 w-full">
                        <p className='col-span-2 text-lg truncate'>{task.name}</p>
                        <p className="justify-self-start self-end text-3xl font-medium">{task.points}</p>
                        <div className="justify-self-end self-center grid grid-cols-2 grid-rows-2 gap-1 place-items-center text-white/50 font-normal">
                            <FlagIcon className='w-4 h-4' strokeWidth={2} />
                            <p className="">{task.solves}</p>
                            <HandThumbUpIcon className="w-4 h-4" strokeWidth={2} />
                            <p className="">{task.likes}</p>
                        </div>
                    </div>

                    {task.isSolved
                        ? (
                            <div className='absolute top-0 left-0 w-full h-full grid place-items-center bg-black/80 backdrop-blur-sm  text-white/60'>
                                <div className='grid grid-cols-1 place-items-center'>
                                    <CheckCircleIcon className='h-16 w-16' strokeWidth={1}/>
                                    <p className=' text-xl font-medium tracking-wider'>Solved</p>
                                </div>
                            </div>
                        ) : null
                    }
                </div>
            </NavLink>
        </motion.div>
    )
}