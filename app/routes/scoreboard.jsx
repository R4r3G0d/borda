import * as React from 'react'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'

import prisma from '~/utils/prisma.server'

export async function loader() {
    try {
        let teams = await prisma.team.findMany()

        let tasks = await prisma.task.findMany({
            select: {
                id: true,
                points: true,
            }
        })

        for (let i = 0; i < teams.length; i++) {
            let team = teams[i]
            let score = 0
            let points = 0

            let solutions = await prisma.solution.findMany({
                where: {
                    teamId: team.id,
                    isCorrect: true,
                }
            })

            console.log({ solutions })

            for (let k = 0; k < solutions.length; k++) {
                for (let j = 0; j < tasks.length; j++) {
                    if (tasks[j].id == solutions[k].taskId) {

                        let solutionCounter = await prisma.solution.count({
                            where: {
                                taskId: tasks[j].id,
                                isCorrect: true,
                            }
                        })

                        if ((solutionCounter > 1) && (tasks[j].points - tasks[j].points * 0.1 * (solutionCounter - 1)) > 0.5 * tasks[j].points) {
                            points = tasks[j].points - tasks[j].points * 0.1 * (solutionCounter - 1)
                        } else if ((solutionCounter > 1) && (tasks[j].points - tasks[j].points * 0.1 * (solutionCounter - 1)) < 0.5 * tasks[j].points) {
                            points = tasks[j].points * 0.5
                        } else {
                            points = tasks[j].points
                        }

                        score += points

                        console.log("I am here", score)
                    }
                }
            }

            teams[i] = { ...team, score: score }
            console.log(teams[i])
        }

        return json({ teams })

    } catch (err) {
        console.log(err)
        throw err
    }
}

export default function teams() {
    let data = useLoaderData()
    console.log({ data })

    return (
        <div className='flex justify-center w-full overflow-auto items-stretch rounded-xl md:items-center content-center'>
            <table className="border-auto table-auto w-full max-w-3xl text-sm">
                <thead>
                    <tr>
                        <th className='w-16 bg-blue-100 border text-left px-8 py-4'>№</th>
                        <th className='bg-blue-100 border text-left px-8 py-4'>Name</th>
                        <th className='bg-blue-100 border text-left px-8 py-4'>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {data.teams.map((team, index) => (
                        <tr key={team.id} className='h-10 whitespace-nowrap'>
                            <td className="border px-8 py-4">
                                <span>{index + 1}</span>
                            </td>
                            <td className='border px-8 py-4'>
                                <span>{team.name}</span>
                            </td>
                            <td className='border px-8 py-4'>
                                <span>{team.score}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}