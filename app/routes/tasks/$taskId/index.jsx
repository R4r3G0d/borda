import * as React from 'react'
import { json } from '@remix-run/node';
import { Link, useLoaderData, useParams, useCatch } from '@remix-run/react'
import clsx from 'clsx'
import { Role } from '@prisma/client'
import ReactMarkdown from 'react-markdown'

import prisma from '~/utils/prisma.server';
import authenticator from "~/utils/auth.server";

import { TaskSolutions, TaskFlagInput, TaskHeader, TaskControls } from '~/components/Task'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

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
                'sticky z-10 top-0 h-14 w-full flex justify-between items-center',
                'border-b border-white border-opacity-25',
                'backdrop-blur-xl backdrop-filter',
                'bg-black/80',
            )}>
                {isAdmin
                    ? <TaskControls />
                    : null
                }
            </div>
            <div className='p-5 w-full grid grid-cols-2 gap-5 self-center'>
                <TaskHeader
                    name={task.name}
                    category={task.category}
                    points={task.points}
                    className={'col-span-2'}
                />
                <div className='text-sm whitespace-nowrap'>
                    by <Link to={`/users/${task.author.id}`} className='underline'>{task.author.displayName}</Link>
                </div>
                {tags
                    ? (
                        <div className='flex flex-row'>
                            {tags.map((tag, idx) => (
                                <div className='px-2 py-px first:m-0 ml-4 rounded-lg text-white text-xs align-middle' key={idx}>{tag}</div>
                            ))}
                        </div>
                    ) : null
                }
                <ReactMarkdown
                    className='col-span-2'
                    children={task.content}
                    components={{
                        ul: function ({ children, ...props }) {
                            return <ul className="list-disc list-inside" {...props}>{children}</ul>
                        },
                        li: function ({ children, ...props }) {
                            return <li className="ml-3" {...props}>{children}</li>
                        },
                        p: function ({ className, ...props }) {
                            return <p className='py-2' {...props}></p>
                        },
                        a: function ({ href, children, ...otherProps }) {
                            return (
                                <>
                                    <a
                                        href={href}
                                        target="_blank"
                                        className='text-rose-600 font-bold hover:cursor-pointer inline-flex items-center'
                                        {...otherProps}
                                    >
                                        <p className=''>{children}</p>
                                        <div className='px-1'>
                                            <ArrowTopRightOnSquareIcon className=' w-4 h-4' />
                                        </div>
                                    </a>
                                </>
                            )
                        },
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
                <TaskFlagInput disabled={task.solved} className='col-span-2' />
                {task.solutions.length > 0
                    ? <TaskSolutions solutions={task.solutions} className='col-span-2' />
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
        <div className="h-full p-5 flex flex-col justify-center items-center">
            <p className="py-2 font-bold text-lg text-center">Something went wrong</p>
            <p className="font-light text-center">We are already working on fixing it.</p>
        </div>
    );
}
