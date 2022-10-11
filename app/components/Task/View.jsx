import { Link } from '@remix-run/react'
import {motion} from 'framer-motion'
import clsx from 'clsx'
import { TaskSolutions, TaskFlagInput, TaskHeader, TaskControls } from '.'

export default function ({ task, controls }) {
    const tags = ['tag1', 'tag2']

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className='relative h-full'
        >
            {controls
                ? <TaskControls />
                : null
            }
            <div className={clsx('h-full w-full', { 'pt-12': controls })}>

                <div className='overflow-y-auto h-full p-5 bg-white'>

                    <TaskHeader
                        name={task.name}
                        category={task.category}
                        points={task.points}
                    />

                    <div className='mt-2 w-full'>
                        <div className='text-black text-sm whitespace-nowrap'>
                            by <Link to={`/users/${task.author.id}`} className='underline'>{task.author.displayName}</Link>

                        </div>
                        <div className='flex flex-row pt-2'>
                            {tags.map((tag, idx) => (
                                <div className='px-2 py-px first:m-0 ml-4 rounded-lg bg-black text-white text-xs align-middle' key={idx}>{tag}</div>
                            ))}

                        </div>
                    </div>

                    <div className='py-5 w-full'>{task.content}</div>

                    <TaskFlagInput />

                    {task.solutions.length > 0
                        ? <TaskSolutions solutions={task.solutions} />
                        : null
                    }
                </div>
            </div>
        </motion.div >

    )
}