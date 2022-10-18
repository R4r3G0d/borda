import { json } from '@remix-run/node';
import { useLoaderData, useParams, useCatch } from '@remix-run/react'
import { Role } from '@prisma/client';

import prisma from '~/utils/prisma.server';
import authenticator from "~/utils/auth.server";
import { TaskView } from '~/components/Task'

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
                solutions: {
                    select: {
                        flag: true,
                        player: { select: { displayName: true } },
                        createdAt: true,
                        isCorrect: true,
                    }
                },
            },
        })

        if (player.teamId) {
            let result = await prisma.solution.findFirst({
                where: {
                    taskId: task.id,
                    teamId: player.teamId,
                    isCorrect: true,
                },
                select: { isCorrect: true },
            })

            let solved = false

            if (result) {
                solved = true
            }

            task = { ...task, solved }
        }

        console.log({ task })

        return json({ task, player })
    } catch (e) {
        console.log(e)
        if (e instanceof NotFoundError) {
            throw new Response('Not Found', { status: 404 });
        }
        throw e
    }
}

export default function Task() {
    let loaderData = useLoaderData();

    return (
        <div className={'h-full flex-auto bg-white border-l border-gray-300'}>
            <TaskView
                task={loaderData.task}
                controls={loaderData.player.role == Role.ADMIN} />
        </div>
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
