import { useLoaderData, useOutletContext, useParams } from '@remix-run/react'
import { TaskView, TaskFooter, TaskHeader, TaskBody } from '../../../components/Task'
import prisma from '~/utils/prisma.server';
import { json } from '@remix-run/node';
import { TaskSolutionsList } from '../../../components/Task/TaskBase';

export async function loader({ params }) {
    let taskId = params.taskId
    let task = await prisma.task.findUnique({
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
            solutions: true,
        },
    })

    return json({ task })
}
function TaskRoute() {
    // const tasks = useOutletContext();
    // const { taskId } = useParams()
    // const task = tasks.find(({ id }) => id === taskId)
    let { task } = useLoaderData()
    return (
        <TaskView>
            <TaskHeader name={task.name} category={task.category} points={task.points} />
            <TaskBody author={task.author} content={task.content} tags={task.tags} />
            {task.solutions.length > 0
                ? <TaskSolutionsList solutions={task.solutions} />
                : null
            }
            <TaskFooter />
        </TaskView>
    )
}

export default TaskRoute