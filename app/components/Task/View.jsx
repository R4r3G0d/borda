import { Link } from '@remix-run/react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import ReactMarkdown from 'react-markdown'

import { TaskSolutions, TaskFlagInput, TaskHeader, TaskControls } from '.'
import { LinkIcon } from '@heroicons/react/24/outline'
// import {ArrowRightOnRectangleIcon} from '@heroicons/react/24/solid'

export default function ({ task, controls }) {
    const tags = task.labels?.split('-')

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
                        {tags
                            ? (
                                <div className='flex flex-row pt-2'>
                                    {tags.map((tag, idx) => (
                                        <div className='px-2 py-px first:m-0 ml-4 rounded-lg bg-black text-white text-xs align-middle' key={idx}>{tag}</div>
                                    ))}
                                </div>
                            )
                            : null

                        }

                    </div>

                    <div className='py-5 w-full'>
                        <ReactMarkdown
                            children={task.content}
                            components={{
                                // Map `h1` (`# heading`) to use `h2`s.
                                // h1: ({ children, ...props }) => <h1 className="mt-1 font-bold">{children}</h1>,
                                // Rewrite `em`s (`*like so*`) to `i` with a red foreground color.
                                // em: ({ node, ...props }) => <i className="text-rose-600" {...props} />,
                                // ul: ({ children, ...props }) => <ul className="list-disc ml-4 mt-4" {...props}>{children}</ul>,
                                // li: ({ children, ...props }) => <li className="" {...props}>{children}</li>,
                                a: ({ children, ...props }) => (
                                    <a className='text-rose-600 font-bold flex flex-nowrap items-center not-italic hover:cursor-pointer' style={{ fontStyle: 'normal' }} {...props}>
                                        <p className='hover:underline hover:text-rose-600 not-italic'>{children}</p>
                                        <LinkIcon className='ml-1 w-4 h-4 text-rose-600' />
                                    </a>
                                ),
                                // img: ({alt, src}) => (
                                //     <div className="relative w-full aspect-video drop-shadow-xl">
                                //         <Image
                                //             src={src}
                                //             alt={alt}
                                //             layout="fill"
                                //             objectFit="cover"
                                //             className="mt-4 mb-4"
                                //         />
                                //     </div>
                                // ),

                            }}
                        />
                    </div>

                    <TaskFlagInput disabled={task.solved} />

                    {task.solutions.length > 0
                        ? <TaskSolutions solutions={task.solutions} />
                        : null
                    }
                </div>
            </div>
        </motion.div >

    )
}