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
    }
    )
        
    return json({ players })
}

export default function PlayersAdminRoute() {
    let {players} = useLoaderData()

    return (
        <div className='flex-grow w-full'>
            <div className='py-5 relative overflow-x-auto'>
                <table className="w-full table-auto">
                    <thead>
                        <tr className='h-12 whitespace-nowrap border-b border-white/30 font-bold '>
                            <td className="px-3 "></td>
                            <td className="px-3 ">Nickname</td>
                            <td className="px-3 ">Email</td>
                            <td className="px-3 ">Telegram</td>
                            <td className="px-3 ">Team</td>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr key={player.id} className='h-12 whitespace-nowrap border-b  border-white/30 last:border-none'>
                                <td className="px-3 font-bold">
                                <input name='playerId' valur={player.id} type='hidden' />
                                        {/* {player.id} */}
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
                                    {player.telegramId}
                                </td>
                                <td className="px-3">
                                    {player.team.name}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

//Редактировать пароль логин почту всё - ты бог пользователей