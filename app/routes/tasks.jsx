import * as React from 'react'
import { json } from '@remix-run/node'
import {
	Link, Outlet,
	useLoaderData, useLocation, useParams, useSearchParams
} from '@remix-run/react'
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon, CheckIcon, PlusIcon } from '@heroicons/react/solid'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { TaskGrid, TaskCard } from '~/components/Task'


export let loader = async ({ request }) => {
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

	await Promise.all(
		tasks.map(async function (task) {
			let solvesCount = await prisma.solution.count({
				where: {
					taskId: task.id,
					isCorrect: false,
				},
			})

			let isSolved = Boolean(false)

			if (player.teamId) {
				let result = await prisma.solution.findFirst({
					where: {
						taskId: task.id,
						teamId: player.teamId,
						isCorrect: false,
					},
					select: { isCorrect: true },
				})

				if (result) {
					isSolved = true
				}
			}


			task.solves = solvesCount;
			task.solved = isSolved;

			task.likes = task._count.likes
			delete task._count
		})
	)

	return json({ tasks, player });
}

const sortOptions = ['category', 'name', 'points']

export default function Tasks() {
	let { tasks, player } = useLoaderData();

	let [searchParams] = useSearchParams();
	let sortProp = searchParams.get("sort");

	let sortedTasks = tasks.sort(function (a, b) {
		return a[sortProp]?.toString().localeCompare(b[sortProp], undefined, { 'numeric': true });
	});

	let location = useLocation();
	let url = location.pathname
	// let newSearchParams = new URLSearchParams({ sort: sortProp });
	let { taskId } = useParams();

	console.log(tasks)

	return (
		<div className="bg-slate-100 h-full w-full">
			<div className='relative hidden md:block md:w-1/2 lg:w-2/3'>
				<div className='sticky top-14 z-10 py-2 flex justify-between bg-slate-100 border-b border-gray-300'>
					<div className='flex felx-row px-3'>
						<div className={'px-3 h-8 font-semibold leading-8 text-sm'}>
							Sort:
						</div>

						<Listbox as={'div'} className={'w-32 relative'} value={sortProp}>

							<Listbox.Button className="h-8 relative flex flex-row justify-between items-center border bg-white">
								<div className="px-3 text-sm capitalize">{sortProp}</div>
								<SelectorIcon
									className="h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</Listbox.Button>
							<Transition
								enter="transition duration-100 ease-out"
								enterFrom="transform scale-95 opacity-0"
								enterTo="transform scale-100 opacity-100"
								leave="transition duration-75 ease-out"
								leaveFrom="transform scale-100 opacity-100"
								leaveTo="transform scale-95 opacity-0"
							>
								<Listbox.Options className={'absolute py-2 bg-black text-white w-32 min-w-full'}>
									{sortOptions.map((option) => (
										<Listbox.Option
											key={option}
											value={option}
										>
											{({ active, selected }) => (
												<Link
													to={`${url}?sort=${option}`}
													className={''}
												>
													<div className='h-8 px-5 text-sm leading-8 capitalize hover:bg-blue-600 w-full flex flex-row justify-between items-center'>
														{option}
														{selected && <CheckIcon className='h-4 w-4' strokeWidth={1} />}
													</div>
												</Link>
											)}

										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
						</Listbox>
					</div>
					{player.role === 'ADMIN'
						? (
							<Link to={'/tasks/new'}
								className='flex flex-row items-center px-2'>
								<PlusIcon className='w-4 h-4' strokeWidth={1} />
								<p className='ml-2 h-8 leading-8 text-sm'>
									New Task
								</p>
							</Link>
						)
						: null}
				</div>
				<TaskGrid>
					{sortedTasks.map((task) => (
						<TaskCard
							task={task}
							key={task.id}
							link={`./${taskId === task.id ? '' : task.id}?${searchParams}`}
							isActive={taskId === task.id}
						/>
					))}
				</TaskGrid>
			</div>
			<Outlet />
		</div >
	);
}
