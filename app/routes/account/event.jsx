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
import { date, z } from 'zod'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { Button } from '~/components/Button'
import { Field } from '~/components/Field'

export async function loader({ request }) {
    let player = await authenticator.isAuthenticated(request);
    try {
        let settings = await prisma.settings.findMany()

        return json({ settings })

    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function action({ request }) {
    let user = await authenticator.isAuthenticated(request)

    const formData = await request.formData()

    let { startDate, finishDate } = Object.fromEntries(formData)

    let start = (Date.parse(startDate))
    let finish = (Date.parse(finishDate))

    try {
        if (startDate.length !== 0) {
            if (!start) { return json({ errors: { start_notValidFormat: 'Написан же пример записи, ты совсем тупой?' } }) }
            else if (start < Date.now()) { return json({ errors: { start_notValidTime: 'Да я смотрю ты живешь в прошлом' } }) }
            let _start = await prisma.settings.update({
                where: {
                    name: 'start'
                },
                data: {
                    value: JSON.stringify(start)
                },
            })
        }
        if (finishDate.length !== 0) {
            if (!finish) { return json({ errors: { finish_notValidFormat: 'Написан же пример записи, ты совсем тупой?' } }) }
            else if (finish < Date.now()) { return json({ errors: { finish_notValidTime: 'Да я смотрю ты живешь в прошлом' } }) }
            let _finish = await prisma.settings.update({
                where: {
                    name: 'finish'
                },
                data: {
                    value: JSON.stringify(finish)
                }
            })
        }

        return redirect('/account/event')

    } catch (err) {
        console.log(err)
        return json({ error: { message: 'Some error. Fix me' } })
    }
}


export default function EventPage() {
    // const submit = useSubmit()

    // function handleChange(event) {
    // submit(event.currentTarget, { replace: true })
    // }
    // function disabledButton() {
    // disabled = false
    // console.log(disabled)
    // return disabled
    // }
    const [disabled, setDisabled] = React.useState(true)
    let data = useLoaderData()
    let actionData = useActionData()
    let startDate = new Date()
    let finishDate = new Date()
    startDate.setTime(data.settings[1].value)
    finishDate.setTime(data.settings[2].value)
    return (
        <div className='flex'>
            <div className='container w-full max-w-2xl mx-auto sm:px-6'>
                <h2 className='py-4 text-2xl text-gray-900 border-b border-gray-300'>
                    AdminKa
                </h2>
                <Form
                    reloadDocument
                    replace
                    method='post'
                    onChange={function (e) {
                        if (e.target.value.length !== 0) {
                            setDisabled(false)
                        } else { setDisabled(true) }
                    }}
                    className='w-full flex flex-col py-5'
                >
                    <div className='flex flex-row justify-between'>
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
                            className='ml-5'
                        />
                    </div>

                    <Field
                        label='Сюда еще что то:'
                    />

                    <Button
                        text='Update'
                        disabled={disabled}
                    />
                </Form>
            </div>
            <div className='border-l px-2 py-2'>
                <div className='text-gray-500'>Start Date: {(startDate.toString()).slice(0, 28)}</div>
                <div className='text-gray-500'>End Date: {(finishDate.toString()).slice(0, 28)}</div>
            </div>
        </div>
    );
}