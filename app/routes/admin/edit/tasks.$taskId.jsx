import * as React from 'react'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { z } from 'zod'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { taskValidator, formatZodError } from '~/utils/validator'
import { Button } from '~/components'
import { Field } from '~/components/Field'

export default function EditTask() {
    const { task } = useLoaderData()
    const actionData = useActionData()
    console.log({ actionData })
    const transition = useTransition()

    // const [disabled, setDisabled] = React.useState(true)

    // TODO: Markdown preview
    // const [mardown, setMarkdown] = React.useState(task.content)

    return (
        <div className="container w-full max-w-2xl mx-auto sm:px-6">
            <h2 className='py-4 text-2xl text-gray-900  border-b border-gray-300'>
                Edit Task
            </h2>
            <Form
                method='post'
                replace
                className='flex flex-wrap  justify-end py-5'
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
                    defaultValue={task.id}
                    disabled
                    className='cursor-not-allowed'
                />
                <Field
                    name='name'
                    label='Name'
                    defaultValue={task.name}
                    error={actionData?.error.name}
                />
                <div className='w-full flex flex-row justify-between'>
                    <Field
                        name='category'
                        label='Category'
                        defaultValue={task.category}
                        error={actionData?.error.category}
                    />
                    <Field
                        name='points'
                        label='Points'
                        defaultValue={task.points}
                        error={actionData?.error.points}
                        className='ml-5'
                    />
                </div>
                <Field
                    name='labels'
                    label='Tags'
                    defaultValue={task.labels}
                    placeholder='tag1-tag2-tag3'
                    error={actionData?.error.labels}
                />
                <Field
                    name='flag'
                    label='Flag'
                    defaultValue={task.flag}
                    error={actionData?.error.flag}
                />
                <Field
                    name='content'
                    label='Description'
                    defaultValue={task.content}
                    type='textarea'
                    style={{ height: 256 }}
                />
                <div className='w-full flex flex-row justify-between'>
                <Field
                    name='active'
                    label='Active'
                    defaultValue={task.active}
                    error={actionData?.error.active}
                />
                <Field
                    name='disabled'
                    label='Disabled'
                    defaultValue={task.disabled}
                    error={actionData?.error.disabled}
                />
                </div>
                <Button
                    text='Save'
                    disabled={transition.submission}
                />
            </Form>
        </div>
    )
}

export async function loader({ request, params }) {
    await authenticator.isAuthenticated(request);

    let task = await prisma.task.findUnique({
        where: { id: params.taskId }
    })

    return json({ task })
}

export async function action({ request, params }) {
    await authenticator.isAuthenticated(request)

    let formData = await request.formData()
    let values = Object.fromEntries(formData)
    let points = values.points
    let disabled = values.disabled
    let active = values.active


    if (disabled == "true"){
        values.disabled = true
    } else {
        values.disabled = false
    }
    if (active == "true"){
        values.active = true
    } else {
        values.active = false
    }
    console.log(values)

    values.points = Number(points)

    try {
        await taskValidator.parse(values)
        await prisma.task.update({
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

    return redirect('/tasks/' + params.taskId)
}