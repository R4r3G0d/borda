import * as React from 'react'
import { Form, useActionData, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { z } from 'zod'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { taskValidator, formatZodError } from '~/utils/validator'
import { Field } from '~/components/Field'
import { Button } from "~/components";


export default function NewTask() {
    const actionData = useActionData();
    const transition = useTransition();

    return (
        <div className="container w-full max-w-2xl mx-auto sm:px-6">
            <h2 className='py-4 text-2xl text-gray-900  border-b border-gray-300'>
                New Task
            </h2>
            <Form
                method='post'
                // reloadDocument
                replace
                className='flex flex-wrap justify-end py-5'
            >
                <Field
                    name='name'
                    label='Name'
                    error={actionData?.error.name}
                />
                <div className='w-full flex flex-row justify-between'>
                    <Field
                        name='category'
                        label='Category'
                        error={actionData?.error.category}
                    />
                    <Field
                        name='points'
                        label='Points'
                        error={actionData?.error.points}
                        className='ml-5'
                    />
                </div>
                <Field
                    name='labels'
                    label='Tags'
                    placeholder='tag1-tag2-tag3'
                    error={actionData?.error.labels}
                />
                <Field
                    name='flag'
                    label='Flag'
                    error={actionData?.error.flag}
                />
                <Field
                    name='content'
                    label='Description'
                    type='textarea'
                    style={{ height: 256 }}
                />

                <Button
                    text='Save'
                    disabled={transition.submission}
                />

                {actionData?.error ? <p>{actionData.error.message}</p> : null}

            </Form>
        </div>
    )
}

export async function action({ request }) {
    player = await authenticator.isAuthenticated(request)

    let formData = await request.formData()
    let values = Object.fromEntries(formData)
    let points = values.points
    values.points = Number(points)

    console.log(values)

    try {
        taskValidator.parse(values)
        task = await prisma.task.create({
            data: {
                ...values,
                author: { connect: { id: player.id } },
                hint: 'hint'
            }
        })

        return redirect('/tasks/' + task.id)

    } catch (err) {
        console.log(err)
        if (err instanceof z.ZodError) {
            let error = formatZodError(err)
            console.log(error)
            return json({ error })
        } else throw err
    }
}