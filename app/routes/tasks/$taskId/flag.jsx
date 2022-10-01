import { json } from '@remix-run/node';
import prisma from '~/utils/prisma.server';
import authenticator from '~/utils/auth.server';
import { validateFlag } from '~/utils/task.server';


export async function action({ request, params }) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const player = await authenticator.isAuthenticated(request);
    const inputFlag = (await request.formData()).get('flag');
    const taskId = params.taskId;


    console.log({ player, inputFlag })
    if (player.teamId === null) {
        return json({ error: { message: 'Please join a team before submitting your answer' } })
    }

    try {
        await validateFlag(inputFlag)
        flag = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
            select: {
                flag: true,
            },
        })

        // console.log({ inputFlag, flag })

        let isCorrect = (inputFlag == flag)
        // console.log(isCorrect)

        let newSolution = await prisma.solution.create({
            data: {
                flag: inputFlag,
                task: { connect: { id: taskId } },
                team: { connect: { id: player.teamId } },
                player: { connect: { id: player.id } },
                isCorrect: isCorrect
            }
        })

        if (isCorrect) {
            return json({ ok: true });
        } else {
            return json({ error: { message: 'Flag is incorrect. Please try again' } })
        }

    } catch (error) {
        console.log(error.message)
        return json({ error: { message: 'There was a problem submitting your answer' } });
    }
}