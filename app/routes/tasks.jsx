import * as React from 'react'
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon } from '@heroicons/react/solid'
import prisma from "../utils/prisma.server";
import authenticator from '~/utils/auth.server';
import { TaskGrid } from '../components/Task';

export let loader = async ({ request }) => {
	let player = await authenticator.isAuthenticated(request, {
		failureRedirect: "/sign-in"
	});

	let tasks = await prisma.task.findMany();

	return json({ tasks });
}

const sortOptions = ['category', 'name', 'points', 'difficulty']

export default function TasksRoute() {
	let { tasks } = useLoaderData();
	let [searchParams] = useSearchParams();
	let sortProp = searchParams.get("sort");
	let activeTaskId = useParams();


	// let sortedTasks = [...tasks].sort((a, b) => {
	// 	return desc
	// 	  ? b[sortProp]?.localeCompare(a[sortProp])
	// 	  : a[sortProp]?.localeCompare(b[sortProp]);
	//   });

	return (
		<div className="px-8">
			<div className='py-2 flex justify-between'>
				<Listbox as={'div'} className={'w-32'}>
					<div className='grid grid-rows-2'>
						<Listbox.Label className={'px-3 h-8 font-semibold leading-8 text-sm'}>Sort</Listbox.Label>
						<Listbox.Button className="h-8 relative flex flex-row justify-between items-center border">
							<div className="px-3 text-sm capitalize">{sortProp}</div>
							<SelectorIcon
								className="h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</Listbox.Button>

					</div>
					<Listbox.Options className={'absolute py-2 bg-black text-white'}>
						{sortOptions.map((option) => (
							<Listbox.Option
								className={'h-8 w-32 px-5 text-sm leading-8 capitalize hover:bg-blue-600'}
								key={option}
								value={option}
							>
								{option}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Listbox>
			</div>
			<TaskGrid tasks={tasks} />
			<Outlet />
		</div>
	);
}
