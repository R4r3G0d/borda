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
        users.forEach(async (user) => {
            // Считаем результат
            let score = 0

            if (user.team) {
                let solutions = await prisma.solution.findMany({
                    where: {
                        teamId: user.team.id,
                        isCorrect: true,
                    },
                })
                console.log({ solutions })

                // for (let i = 0; i < solutions.length; i++) {
                solutions.forEach((solution) => {
                    for (let j = 0; j < tasks.length; j++) {
                        // console.log(`${task.id} ${solution.taskId}`)

                        // console.log(task.id, solution.taskId)
                        if (tasks[j].id == solution.taskId) {
                            // if (tasks[j].id == solutions[i].taskId) {
                            console.log("I am here")
                            // Нужна формула по-сложнее
                            score += tasks[j].points

                            console.log(score)

                            user = Object.assign(user, { score: score });
                        }
                    }
                })
            }

            // console.log(`${user.displayName}: ${score}`)

            // user.score = score
            user = Object.assign(user, { score: score });

            // console.log({ user })
        })

        // Ищем правильно решеные таски для каждого игрока
        // for (let user of users) {


        //     // Считаем результат
        //     let score

        //     if (user.team) {
        //         let solutions = await prisma.solution.findMany({
        //             where: {
        //                 teamId: user.team.id,
        //                 isCorrect: true,
        //             },
        //         })

        //         for (let solution of solutions) {
        //             for (let task of tasks) {
        //                 console.log(`${task.id} ${solution.taskId}`)

        //                 if (solution.taskId == task.id) {
        //                     // Нужна формула по-сложнее
        //                     score = score + task.points
        //                 }
        //             }
        //         }
        //     }
        //     // console.log(`${user.displayName}: ${score}`)

        //     user.score = score
        //     // user = Object.assign(user, score);

        //     // console.log({ user })
        // }

        console.log({ users })
        return json({ users })
    }
    catch (err) {
        console.log(err)
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