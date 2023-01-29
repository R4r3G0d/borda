import * as React from 'react'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { z } from 'zod'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { taskValidator, formatZodError } from '~/utils/validator'
import { Button } from '~/components'
import { Field } from '~/components/Field'
import { passwordValidator } from '../../../utils/validator'

export default function EditPlayer() {
    const { player } = useLoaderData()
    const actionData = useActionData()
    console.log({ actionData })
    const transition = useTransition()

    // const [disabled, setDisabled] = React.useState(true)

    // TODO: Markdown preview
    // const [mardown, setMarkdown] = React.useState(task.content)

    return (
        <div className="container w-full max-w-2xl mx-auto sm:px-6">
            <h2 className='py-4 text-2xl text-white  border-b border-gray-300'>
                Edit Player
            </h2>
            <Form
                method='post'
                replace
                className='pt-5 grid grid-cols-2 gap-5'
            // TODO: disable button until form values changed
            // onChange={function (e) {
            //     if (player.displayName !== e.target.value) {
            //         setDisabled(false)
            //     } else { setDisabled(true) }
            // }}
            >
                <Field
                    name='id'
                    label='ID'
                    defaultValue={player.id}
                    disabled
                    className='cursor-not-allowed col-span-2'
                />

                <Field
                    name='name'
                    label='Name'
                    defaultValue={player.displayName}
                    error={actionData?.error.displayName}
                />

                <Field
                    name='telegramId'
                    label='Telegram'
                    defaultValue={player.telegramId}
                    error={actionData?.error.telegramId}
                />

                <Field
                    name='email'
                    label='Email'
                    className='col-span-2'
                    defaultValue={player.email}
                    error={actionData?.error.email}
                />

                <Field
                    name='password'
                    label='Password'
                    error={actionData?.errors.password}
                />
                

                <Button
                    text='Save'
                    disabled={transition.submission}
                    className='col-span-2 self-center justify-self-end'
                />

            </Form >
        </div >
    )
}

export async function loader({ request, params }) {
    await authenticator.isAuthenticated(request);

    let player = await prisma.player.findUnique({
        where: { id: params.playerId }
    })

    return json({ player })
}

export async function action({ request, params }) {
    await authenticator.isAuthenticated(request)

    let formData = await request.formData()
    let values = Object.fromEntries(formData)
    let password = values.password
    values.password = Number(points)

    try {
        await passwordValidator.parse(values)
        await prisma.player.update({
            where: { id: params.taskId },
            data: {
                ...values
            }
        })

    } catch (err) {
        console.log(err)
        if (err instanceof z.ZodError) {
            let error = formatZodError(err)
            console.log(error)
            return json({ error })
        }
    }

    return redirect('/players/' + params.playerId)
}