import { useLoaderData, Form } from '@remix-run/react'
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
        let players = await prisma.player.findMany()

        return json({ players })
    } catch (err) {
        console.log(err)
        throw err
    }
}

export default function players() {
    let data = useLoaderData()
    //let actionData = useActionData()

    return (
        <div className='container max-w-5xl mx-auto'>
        <div className='mt-14 px-5 w-full'>

            <div className='py-5 relative overflow-x-auto'>
                <table className="w-full table-auto">
                    <thead>
                        <tr className='h-12 whitespace-nowrap border-b border-white/30 font-bold '>
                            <td className="px-3">TaskId</td>
                            <td className="px-3">Name</td>
                            <td className="px-3 text-center">Description</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.players.map((player) => (
                            <tr key={player.id} className='h-12 whitespace-nowrap border-b  border-white/30 last:border-none'>
                                <td className="px-3 font-bold">
                                    <Button 
                                    />
                                </td>
                                <td className="px-3">
                                    {player.email}
                                </td>
                                <td className="px-3">
                                    {player.password}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

//Редактировать пароль логин почту всё - ты бог пользователей