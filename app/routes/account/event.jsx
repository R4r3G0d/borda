import * as React from 'react'
import {
    useLoaderData,
    Form,
    useActionData,
} from '@remix-run/react'
import {
    json,
    redirect,
} from '@remix-run/node'
import { z } from 'zod'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { Button } from '~/components'
import { Field } from '~/components/Field'

export async function action({ request }) {
    let user = await authenticator.isAuthenticated(request)

    const formData = await request.formData()

    let { startDate, finishDate } = Object.fromEntries(formData)

    let start = (Date.parse(startDate))
    let finish = (Date.parse(finishDate))


    if (startDate.length != 0) {
        if (!start) { return json({ errors: { start_notValidFormat: 'Написан же пример записи, ты совсем тупой?' } }) }
        else if (start < Date.now()) { return json({ errors: { start_notValidTime: 'Да я смотрю ты живешь в прошлом' } }) }
        try {
            await prisma.settings.update({
                where: {
                    name: 'start'
                },
                data: {
                    value: JSON.stringify(start)
                },
            })

            return redirect('/account/event')

        } catch (err) {
            console.log(err)
            return json({ error: { message: 'Some error. Fix me' } })
        }
    }
    if (finishDate.length != 0) {
        if (!finish) { return json({ errors: { finish_notValidFormat: 'Написан же пример записи, ты совсем тупой?' } }) }
        else if (finish < Date.now()) { return json({ errors: { finish_notValidTime: 'Да я смотрю ты живешь в прошлом' } }) }
        try {
            await prisma.settings.update({
                where: {
                    name: 'finish'
                },
                data: {
                    value: JSON.stringify(finish)
                },
            })

        } catch (err) {
            console.log(err)
            return json({ error: { message: 'Some error. Fix me' } })
        }
    }
}
export async function loader({ request }) {
    let player = await authenticator.isAuthenticated(request);

    return json({ player })
}

export default function EventPage() {
    // const submit = useSubmit()

    // function handleChange(event) {
    //     submit(event.currentTarget, { replace: true })
    // }
    // function disabledButton() {
    //     disabled = false
    //     console.log(disabled)
    //     return disabled
    // }
    const [disabled, setDisabled] = React.useState(true)

    let actionData = useActionData()

    return (
        <div className='container w-full max-w-2xl mx-auto sm:px-6'>
            <Form
                reloadDocument
                replace
                method='post'
                onChange={function (e) {
                    if (actionData.start.length != 0 || actionData.finish.length != 0) {
                        setDisabled(false)
                    } else { setDisabled(true) }
                }}
                className='pt-5 pb-10 grid grid-cols-2 gap-5'
            >
                <h2 className='col-span-2 py-2 text-lg text-white border-b border-white/30'>
                    Event dates
                </h2>
                <Field
                    name='startDate'
                    label='Start Date'
                    placeholder='2020-09-25 18:36'
                    error={actionData?.errors.start_notValidFormat || actionData?.errors.start_notValidTime}
                />
                <Field
                    name='finishDate'
                    label='End Date'
                    placeholder='2020-09-25 18:36'
                    error={actionData?.errors.finish_notValidFormat || actionData?.errors.finish_notValidTime}
                />
                <Button
                    text='Update'
                    className='col-span-2 self-center justify-self-end'
                />
            </Form>
        </div>
    );
}