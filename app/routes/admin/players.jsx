import { useLoaderData, Link } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { TrashIcon } from '@heroicons/react/24/outline'
import { StarIcon, InformationCircleIcon } from '@heroicons/react/24/solid'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { getSession, commitSession } from '~/utils/session.server'
import { Field } from '~/components/Field'
import { Button } from '~/components'

export async function loader() {
    let players = await prisma.player.findMany({
        select: {
            id: true,
            displayName: true,
            team: { select: { name: true } },
            email: true,
            telegramId: true,
        }
    })

    return json({ players })
}

export default function PlayersAdminRoute() {
    let { players } = useLoaderData()

    return (
        <div className='px-5 w-full overflow-x-auto'>
            <h2 className='ml-3 py-2 text-xl text-white'>
                Players
            </h2>
            <table className="w-full table-auto">
                <thead>
                    <tr className='h-16 whitespace-nowrap border-b border-white/30 font-bold '>
                        <td className="px-3 ">ID</td>
                        <td className="px-3 "></td>
                        <td className="px-3 ">Name</td>
                        <td className="px-3 ">Email</td>
                        <td className="px-3 ">Team</td>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => (
                        <tr key={player.id} className='h-16 whitespace-nowrap border-b  border-white/30 last:border-none'>
                            <td className="px-3">
                                <p>{player.id}</p>
                            </td>
                            <td className="px-3">
                                <Link to={`/admin/edit/players/${player.id}`}>
                                    <Button
                                        text='Edit'
                                    />
                                </Link>
                            </td>
                            <td className="px-3">
                                {player.displayName}
                            </td>
                            <td className="px-3">
                                {player.email}
                            </td>
                            <td className="px-3">
                                {player.team?.name}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

//Редактировать пароль логин почту всё - ты бог пользователей