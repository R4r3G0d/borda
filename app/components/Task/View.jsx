import { Link } from '@remix-run/react'
import { TaskSolutions, TaskFlagInput, TaskHeader } from '.'

export default function ({ task, children }) {
    const tags = ['tag1', 'tag2']

    return (
        <div className='fixed h-screen p-5 mt-14 bg-white'>
            {children}

            <TaskHeader
                name={task.name}
                category={task.category}
                points={task.points}
            />

            <div className='mt-2'>
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
    )
}