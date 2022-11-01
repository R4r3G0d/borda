import { json } from '@remix-run/node'
import {z} from 'zod'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { flagValidator, formatZodError } from '~/utils/validator'


export async function action({ request, params }) {
    const player = await authenticator.isAuthenticated(request)
    const formData = await request.formData()
    const values = Object.fromEntries(formData)

    if (!player.teamId) {
        return json({ error: { message: 'Please join a team before submitting your answer' } })
    }

    let correctSolution = await prisma.solution.findFirst({
        where: {
            id: params.taskId,
            teamId: player.teamId,
            isCorrect: true,
        }
    })

    if (correctSolution) {
        return json({ error: { message: 'You already solve this task, cheater :) Try to solve an other one.' } })
    }

    try {
        await flagValidator.parse(values.flag)

        const task = await prisma.task.findUnique({
            where: {
                id: params.taskId,
            },
            select: {
                // solutionsCounter: true, rmnvlv
                flag: true,
            },
        })

        const solution = await prisma.solution.create({
            data: {
                flag: values.flag,
                task: { connect: { id: params.taskId } },
                team: { connect: { id: player.teamId } },
                player: { connect: { id: player.id } },
                isCorrect: values.flag == task.flag
            }
        })

        if (!solution.isCorrect) {
            return json({ error: { message: 'Flag is incorrect. Please try again' } })
        }

        return json({ ok: true })

    } catch (err) {
        console.log(err)

        if (err instanceof z.ZodError) {
            let error = formatZodError(err)
            console.log(error)
            return json({ error })
        }

        return json({ error: { message: 'There was a problem submitting your answer' } })
    }
}