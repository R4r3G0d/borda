import * as React from 'react'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'

import prisma from '~/utils/prisma.server'

export const meta = () => ({
    title: 'SCOREBOARD | CTFBOARD',
});

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
                    }
                }
            }

            teams[i] = { ...team, score: score }
        }
        return json({ teams })
    } catch (err) {
        console.log(err)
        throw err
    }
}

export default function teams() {
    let data = useLoaderData()

    let sortedTeams = data.teams.sort(function (a, b) {
        return b.score?.toString().localeCompare(a.score, undefined, { 'numeric': true });
    });

    return (
        <div className='container max-w-5xl mx-auto'>
            <div className='mt-14 px-5 w-full'>

                <div className='py-5 relative overflow-x-auto'>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className='h-12 whitespace-nowrap border-b border-white/30 font-bold '>
                                <td className="px-3" >№</td>
                                <td className="px-3">Name</td>
                                <td className="px-3 text-center">Score</td>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTeams.map((team, index) => (
                                <tr key={team.id} className='h-12 whitespace-nowrap border-b  border-white/30 last:border-none'>
                                    <td className="px-3 font-bold">
                                        {index + 1}
                                    </td>
                                    <td className="px-3">
                                        {team.name}
                                    </td>
                                    <td className="px-3 text-center">
                                        {team.score}
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