import * as React from 'react'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { z } from 'zod'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { formatZodError } from '~/utils/validator'
import { Button } from '~/components'
import { Field } from '~/components/Field'
import { passwordValidator } from '../../../utils/validator'
import { hashPassword } from '../../../utils/auth.server'

export default function EditPlayer() {
    const { player } = useLoaderData()
    const actionData = useActionData()
    console.log({ actionData })
    const transition = useTransition()

    return (
        <div className="container w-full max-w-2xl mx-auto sm:px-6">
            <h2 className='py-4 text-2xl text-white  border-b border-gray-300'>
                Edit Player
            </h2>
            <Form
                method='post'
                replace
                className='pt-5 grid grid-cols-2 gap-5'
            >
                <Field
                    name='id'
                    label='ID'
                    defaultValue={player.id}
                    disabled
                    className='cursor-not-allowed col-span-2'
                />
                <Field
                    name='displayName'
                    label='Name'
                    defaultValue={player.displayName}
                    error={actionData?.error.displayName}
                />
                <Field
                    name='telegramId'
                    label='Telegram'
                    defaultValue={player.telegramId}
                    error={actionData?.error.telegramId}
                    disabled
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
                    className='col-span-2'
                    error={actionData?.error.password}
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

    // let password = formData.get("password")
    // let eamil = formData.get("email")


    let data = {}

    Object.entries(values).forEach(async function ([key, value]) {
        if (value != '') {
            if (key === 'password') {
                data[key] = await hashPassword(data.password)
            } else {
                data[key] = value
            }
        }
    })

    await prisma.player.update({ where: { id: params.playerId }, data })

    return redirect('/admin/edit/players/' + params.playerId)
}