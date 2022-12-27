import { json } from '@remix-run/node';
import { Link, useLoaderData, useParams, useCatch } from '@remix-run/react'
import clsx from 'clsx'
import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'
import { Role } from '@prisma/client'

import prisma from '~/utils/prisma.server';
import authenticator from "~/utils/auth.server";

import { TaskSolutions, TaskFlagInput, TaskHeader, TaskControls } from '~/components/Task'
import { LinkIcon } from '@heroicons/react/24/outline'

export async function loader({ request, params }) {
    let player = await authenticator.isAuthenticated(request);
    let taskId = params.taskId
    try {
        let task = await prisma.task.findUniqueOrThrow({
            where: {
                id: taskId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        displayName: true,
                    },
                },
            },
        })

        let solutions = []
        let solved = false

        if (player.teamId) {
            solutions = await prisma.solution.findMany({
                where: {
                    taskId: task.id,
                    teamId: player.teamId,
                },
                select: {
                    id: true,
                    flag: true,
                    player: { select: { displayName: true } },
                    createdAt: true,
                    isCorrect: true,
                }
            })

            let result = await prisma.solution.findFirst({
                where: {
                    taskId: task.id,
                    teamId: player.teamId,
                    isCorrect: true,
                },
                select: { isCorrect: true },
            })

            if (result) {
                solved = true
            }

        }

        task = { ...task, solved, solutions }

        return json({ task, player })
    } catch (e) {
        console.log(e)
        throw e
    }
}

export default function Task() {
    let { task, player } = useLoaderData();
    const tags = task?.labels?.split('-')
    let isAdmin = player?.role == Role.ADMIN

    return (
        <>
            <div className={clsx(
                'sticky z-10 top-0 h-12 w-full flex justify-between items-center',
                'border-b border-white border-opacity-25',
                'backdrop-blur-xl backdrop-filter',
                'bg-neutral-800 bg-opacity-30',
            )}>
                {isAdmin
                    ? <TaskControls />
                    : null
                }
            </div>

            <div className='p-5'>
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
                        ) : null
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
        </>
    )
}

export function CatchBoundary() {
    const caught = useCatch();
    const params = useParams();

    switch (caught.status) {
        case 404: {
            return (<h2>Task with ID <pre>{params.taskId}</pre> not found!</h2>)
        }
        default: {
            // if we don't handle this then all bets are off. Just throw an error
            // and let the nearest ErrorBoundary handle this
            throw new Error(`${caught.status} not handled`);
        }
    }
}

export function ErrorBoundary({ error }) {
    console.log(error)
    return (
        <div className=''>
            <p>Something went wrong</p>
            <p>We are already working on fixing it</p>
            <pre>{error.stack}</pre>
        </div>
    );
}
