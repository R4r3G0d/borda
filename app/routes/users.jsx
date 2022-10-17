import * as React from 'react'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'

import prisma from '~/utils/prisma.server'

export async function loader() {
    try {
        // Получаем id и имена и название команд всех игроков
        let users = await prisma.player.findMany({
            select: {
                id: true,
                displayName: true,
                team: { select: { id: true, name: true } },
                solutions: true,
            }
        })

        // Получаем очки тасков заранее, чтобы 
        // не делать лишних запросов к таскам для каждого решения каждого игрока
        let tasks = await prisma.task.findMany({
            select: { id: true, points: true }
        })

        // Ищем правильно решеные таски для каждого игрока
        for (let i = 0; i < users.length; i++) {
            let user = users[i]
            // Считаем результат
            let score = 0

            if (users[i].team) {
                let solutions = await prisma.solution.findMany({
                    where: {
                        teamId: user.team.id,
                        isCorrect: true,
                    },
                })
                console.log({ solutions })

                for (let s = 0; s < solutions.length; s++) {
                    for (let j = 0; j < tasks.length; j++) {
                        if (tasks[j].id == solutions[s].taskId) {
                            // Нужна формула по-сложнее
                            score += tasks[j].points

                            console.log(score)
                        }
                    }
                }
            }

            users[i] = { ...user, score: score }
        }

        return json({ users })
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export default function users() {
    let data = useLoaderData()
    console.log({ data })

    return (
        <div className='flex justify-center w-full overflow-auto items-stretch rounded-xl md:items-center content-center'>
            <table className="border-auto table-auto w-full max-w-3xl text-sm">
                <thead>
                    <tr>
                        <th className='w-16 bg-blue-100 border text-left px-8 py-4'>№</th>
                        <th className='bg-blue-100 border text-left px-8 py-4'>Name</th>
                        <th className='bg-blue-100 border text-left px-8 py-4'>Team</th>
                        <th className='bg-blue-100 border text-left px-8 py-4'>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {data.users.map((user, index) => (
                        <tr key={user.id} className='h-10 whitespace-nowrap'>
                            <td className="border px-8 py-4">
                                <span>{index + 1}</span>
                            </td>
                            <td className='border px-8 py-4'>
                                <span>{user.displayName}</span>
                            </td>
                            <td className='border px-8 py-4'>
                                <span>{user.team ? user.team.name : "no team"}</span>
                            </td>
                            <td className='border px-8 py-4'>
                                <span>{user.score}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}