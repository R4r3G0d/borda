import { useLoaderData, Link, useActionData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { TrashIcon } from '@heroicons/react/24/outline'
import { StarIcon, InformationCircleIcon } from '@heroicons/react/24/solid'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { getSession, commitSession } from '~/utils/session.server'
import { Field } from '~/components/Field'
import { Button } from '~/components'

export async function loader() {
    try {
        let tasks = await prisma.task.findMany()

        return json({ tasks })
    } catch (err) {
        console.log(err)
        throw err
    }
}

export default function tasks() {
    let data = useLoaderData()
    let actionData = useActionData()

    return (
        <div className='px-5 w-full overflow-x-auto'>
            <h2 className='ml-3 py-2 text-xl text-white'>
                Tasks
            </h2>
            <div className='w-full overflow-x-auto'>
                <table className="w-full table-auto">
                    <thead>
                        <tr className='h-16 whitespace-nowrap border-b border-white/30 font-bold '>
                            <td className="px-3">TaskId</td>
                            <td className="px-3">Name</td>
                            <td className="px-3"></td>
                            <td className="px-3">Description</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.tasks.map((task) => (
                            <tr key={task.id} className='h-16    whitespace-nowrap border-b  border-white/30 last:border-none'>
                                <td className="px-3">
                                    <p className=''>{task.id}</p>
                                    {/* <input name='taskId' value={task.id} type='hidden' /> */}
                                </td>
                                <td className="px-3">
                                    {task.name}
                                </td>
                                <td className="px-3">
                                    <Link to={`/admin/edit/tasks/${task.id}`}>
                                        <Button
                                            text='Edit'
                                        />
                                    </Link>
                                </td>
                                <td className="px-3">
                                    {task.content}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}