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
                // score: true, // Альтернативный вариант
            }
        })

        // Получаем очки тасков заранее, чтобы 
        // не делать лишних запросов к таскам для каждого решения каждого игрока
        let tasks = await prisma.task.findMany({
            // TODO: Добавить условие что таск активный 
            select: {
                id: true,
                points: true,
                // solutionsCounter: true, // Альтернативный вариант
            }
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

                            //Считаем все удачные решения для таска
                            let solutionCounter = await prisma.solution.count({
                                where: {
                                    taskId: tasks[j].id,
                                    isCorrect: true,
                                }
                            })

                            //Нужна формула по-сложнее
                            //Вот формула посложнее
                            if ((solutionCounter > 1) && (tasks[j].points - tasks[j].points * 0.1 * (solutionCounter - 1)) > 0.5 * tasks[j].points) {
                                points = tasks[j].points - tasks[j].points * 0.1 * (solutionCounter - 1)
                            } else if ((solutionCounter > 1) && (tasks[j].points - tasks[j].points * 0.1 * (solutionCounter - 1)) < 0.5 * tasks[j].points) {
                                points = tasks[j].points * 0.5
                            } else {
                                points = tasks[j].points
                            }

                            score += points
                        }
                    }
                }
            }

            users[i] = { ...user, score: score }
        }


        // Альтернативный вариант
        // Ищем правильно решеные таски для каждого игрока
        // users.forEach(async (user) => {
        //     // Считаем результат
        //     let score = 0

        //     if (user.team) {
        //         let solutions = await prisma.solution.findMany({
        //             where: {
        //                 teamId: user.team.id,
        //                 isCorrect: true,
        //             },
        //         })

        //         solutions.forEach((solution) => {
        //             for (let j = 0; j < tasks.length; j++) {
        //                 if (tasks[j].id == solution.taskId) {

        //                     console.log("I am here")
        //                     // Вот формула посложнее
        //                     if ((tasks[j].solutionsCounter > 1) && (tasks[j].points - tasks[j].points * 0.1 * (tasks[j].solutionsCounter - 1)) > 0.5 * tasks[j].points) {
        //                         points = tasks[j].points - tasks[j].points * 0.1 * (tasks[j].solutionsCounter - 1)
        //                     } else if ((tasks[j].solutionsCounter > 1) && (tasks[j].points - tasks[j].points * 0.1 * (tasks[j].solutionsCounter - 1)) < 0.5 * tasks[j].points) {
        //                         points = tasks[j].points * 0.5
        //                     } else {
        //                         points = tasks[j].points
        //                     }

        //                     score += points
        //                     // console.log("Score: ", score)

        //                     console.log(score)
        //                 }
        //             }
        //         })

        //         let updateUser = await prisma.player.update({
        //             where: {
        //                 id: user.id,
        //             },
        //             data: {
        //                 score: score,
        //             },
        //         })
        //     }
        // })

        return json({ users })
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export default function users() {
    let data = useLoaderData()
    console.log("Final data: ", { data })

    let sortedUsers = data.users.sort(function (a, b) {
        return b.score?.toString().localeCompare(a.score, undefined, { 'numeric': true });
    });

    return (
        <div className='container max-w-5xl mx-auto'>
            <div className='mt-14 px-5 w-full'>

                <div className='py-5 relative overflow-x-auto'>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className='h-12 whitespace-nowrap border-b border-white/30 font-bold'>
                                <td className="px-3" >№</td>
                                <td className="px-3">Name</td>
                                <td className="px-3">Team</td>
                                <td className="px-3 text-center">Score</td>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user, index) => (
                                <tr key={user.id} className='h-12 whitespace-nowrap border-b border-white/30 last:border-none '>
                                    <td className="px-3 font-bold">
                                        {index + 1}
                                    </td>
                                    <td className="px-3">
                                        {user.displayName}
                                    </td>
                                    <td className='px-3'>
                                        {user.team ? user.team.name : "no team"}
                                    </td>
                                    <td className="px-3 text-center">
                                        {user.score}
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