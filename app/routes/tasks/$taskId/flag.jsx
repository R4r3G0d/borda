import { json } from '@remix-run/node';
import prisma from '~/utils/prisma.server';
import authenticator from '~/utils/auth.server';


export async function action({ request, params }) {
    const player = await authenticator.isAuthenticated(request);
    const inputFlag = (await request.formData()).get('flag');
    const taskId = params.taskId;

    console.log({ player, inputFlag })

    try {
        flag = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
            select: {
                flag: true,
            },
        })

        console.log({ inputFlag, flag })

        let isCorrect = (inputFlag == flag)
        console.log(isCorrect)

        await prisma.solution.create({
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
            return json({ error: 'Incorrect Flag' })
        }

    } catch (error) {
        console.log(error)
        return json({ error: 'Internal error' });
    }
}