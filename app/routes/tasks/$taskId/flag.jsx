import { json } from '@remix-run/node';
import prisma from '~/utils/prisma.server';
import authenticator from '~/utils/auth.server';
import { validateFlag } from '~/utils/task.server';


export async function action({ request, params }) {
    // await new Promise(resolve => setTimeout(resolve, 1000));

    const player = await authenticator.isAuthenticated(request);
    const inputFlag = (await request.formData()).get('flag');
    const taskId = params.taskId;


    console.log({ player, inputFlag })
    if (player.teamId === null) {
        return json({ error: { message: 'Please join a team before submitting your answer' } })
    }

    let oldSolution = await prisma.solution.findFirst({
        where: {
            id: taskId,
            teamId: player.teamId,
            isCorrect: true,
        }
    })

    try {
        await validateFlag(inputFlag)
        task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
            select: {
                // solutionsCounter: true, rmnvlv
                flag: true,
            },
        })

        let isCorrect = (inputFlag == task.flag)

        let newSolution = await prisma.solution.create({
            data: {
                flag: inputFlag,
                task: { connect: { id: taskId } },
                team: { connect: { id: player.teamId } },
                player: { connect: { id: player.id } },
                isCorrect: isCorrect
            }
        })

        if (isCorrect && oldSolution == null) {
            // rmnlvl
            // counter = 1 + task.solutionsCounter
            // let correctSolution = await prisma.task.update({
            //     where: {
            //         id: taskId,
            //     },
            //     data: {
            //         solutionsCounter: counter,
            //     }
            // })
            return json({ ok: true });
        } else if (oldSolution == null) {
            return json({ error: { message: 'Flag is incorrect. Please try again' } })
        } else {
            return json({ error: { message: 'You already solve this task. He-he cheater :)' } })
        }

    } catch (error) {
        console.log(error.message)
        return json({ error: { message: 'There was a problem submitting your answer' } });
    }
}