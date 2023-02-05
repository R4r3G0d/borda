import * as React from 'react'
import { json } from '@remix-run/node'
import {
	Outlet,
    useLoaderData,
    useLocation,
    useParams,
    useSearchParams
} from '@remix-run/react'
import { motion } from 'framer-motion'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { TaskGrid, TaskCard } from '~/components/Task'

export const meta = () => ({
    title: 'TASKS | CTFBOARD',
});

export async function loader({ request }) {
	try {
		let player = await authenticator.isAuthenticated(request, {
			failureRedirect: "/sign-in"
		});

		let tasks = await prisma.task.findMany({
			where: {
				disabled: false,
			},
			include: {
				author: {
					select: {
						id: true,
						displayName: true,
					},
				},
				_count: {
					select: {
						likes: true,
						// solutions: true,
						// solutions: { where: { isCorrect: true } },
					},
				},
			},
		});

		for (let i = 0; i < tasks.length; i++) {
			let task = tasks[i]

			let solves = await prisma.solution.count({
				where: {
					taskId: task.id,
					isCorrect: true,
				},
			})

			let points = 0

			if ((solves.length > 1) && (task.points - task.points * 0.1 * (solves.length - 1)) > 0.5 * task.points) {
				points = task.points - task.points * 0.1 * (solves.length - 1)
			} else if ((solves.length > 1) && (task.points - task.points * 0.1 * (solves.length - 1)) < 0.5 * task.points) {
				points = task.points * 0.5
			} else {
				points = task.points
			}

			tasks[i].points = points

			let isSolved = false

			if (player.teamId) {
				let result = await prisma.solution.findFirst({
					where: {
						taskId: task.id,
						teamId: player.teamId,
						isCorrect: true,
					},
					select: { isCorrect: true },
				})

				if (result) {
					isSolved = true
				}
			}

			let likes = task._count.likes

			delete task._count

			tasks[i] = { ...task, solves, likes, isSolved }
		}

		return json({ tasks, player });
	}
	catch (err) {
		console.log(err)
		throw err
	}
}

export default function Tasks() {
	let { tasks } = useLoaderData();

	let [searchParams] = useSearchParams();
	let sortProp = searchParams.get("sort");

	let sortedTasks = tasks.sort(function (a, b) {
		return a[sortProp]?.toString().localeCompare(b[sortProp], undefined, { 'numeric': true });
	});

	let { taskId } = useParams();

	return (
			<div className='min-h-screen w-full flex flex-1'>
				<TaskGrid>
					{sortedTasks.map((task) => (
						<TaskCard
							task={task}
							key={task.id}
							link={`./${taskId === task.id ? '' : task.id}?${searchParams}`}
							isFocused={taskId === task.id}
						/>
					))}
				</TaskGrid>
				<motion.div
					key={useLocation().pathname}
					initial={{ y: '100', opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ x: '-100', opacity: 0 }}
					transition={{ duration: 0.3 }}
					className='w-taskView'
				>
					<Outlet />
				</motion.div>
			</div>
	);
}
