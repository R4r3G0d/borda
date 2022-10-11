import * as React from 'react'
import { Link, useLoaderData } from '@remix-run/react'
import prisma from '~/utils/prisma.server'
import { json } from '@remix-run/node'

export async function loader() {
    // взяли всех юзеров с командой
    let users = await prisma.player.findMany({
        include: {
            team: true,
        },
    })

    // const users = await prisma.user.findMany({})

    // const userIds = users.map((x) => x.id)

    // const posts = await prisma.post.findMany({
    //     where: {
    //         authorId: {
    //             in: userIds,
    //         },
    //     },
    // })

    // итерируемся по каждому юзеру из юзеров
    users.forEach(async function (user) {
        // Достали все правильные решения пользователя по ВСЕМ таскам
        let solutions = await prisma.solution.findMany({
            where: {
                playerId: user.id,
                isCorrect: true,
            },
        })

        let s = 0

        // Идем по правильным решениям пользователя
        await Promise.all(
            solutions.forEach(async function (solution) {

                //Достали таск, который пользователь решил
                let task = await prisma.task.findUnique({
                    where: {
                        id: solution.taskId
                    }
                })

                //Достаем все правильные решения этого таска и считаем
                // let taskSolutions = await prisma.solutions.findMany({
                //     select:{
                //         _count:{
                //             select:{
                //                 id: { where: { id: task.id, isCorrect: true,} },
                //             },
                //         },
                //     },
                // })
                let taskSolutions = await prisma.solution.count({
                    where: {
                        taskId: task.id,
                        isCorrect: true,
                    },
                })

                console.log(taskSolutions)

                if ((task.points * 0.5) > (task.points - taskSolutions * 0.1 * task.points)) {
                    s = s + (task.points * 0.5)
                } else {
                    s = s + task.points - (taskSolutions * 0.1 * task.points)
                }

            })
        )

        user.score = s
    })

    return json({ users })
}

export default function users() {
    let data = useLoaderData()
    console.log(data.users)

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
                        <tr className='h-10 whitespace-nowrap'>
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
                                <span>{user.score ? user.score : 0}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}