import { useLoaderData, useParams, useCatch } from '@remix-run/react'
import { json } from '@remix-run/node';
import { TaskView, TaskFooter, TaskHeader, TaskBody, TaskControls, TaskSolutionsList } from '~/components/Task'
import prisma from '~/utils/prisma.server';
import authenticator from "~/utils/auth.server";
// import { NotFoundError } from '@prisma/client/runtime';

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
    let { task } = useLoaderData()
    let sortedSolutions = task.solutions.sort(function (a, b) {
        return b.createdAt.localeCompare(a.createdAt);
    });
    return (
        <TaskView>
            {loaderData.player?.role == 'ADMIN'
                ? <TaskControls />
                : null
            }
            <TaskHeader name={task.name} category={task.category} points={task.points} />
            <TaskBody author={task.author} content={task.content} tags={task.tags} />
            {task.solutions.length > 0
                ? <TaskSolutionsList solutions={sortedSolutions} />
                : null
            }
            <TaskFooter />
        </TaskView>
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
    return (
        <div className=''>
            <p>Something went wrong</p>
            <p>We are already working on fixing it</p>
            <pre>{error.stack}</pre>
        </div>
    );
}
