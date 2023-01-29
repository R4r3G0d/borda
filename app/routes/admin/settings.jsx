import * as React from 'react'
import {
    Form,
    useActionData,
} from '@remix-run/react'
import {
    json,
    redirect,
} from '@remix-run/node'

import prisma from '~/utils/prisma.server'
import { Button } from '~/components'
import { Field } from '~/components/Field'

export async function action({ request }) {
    const formData = await request.formData()

    let { startDate, finishDate } = Object.fromEntries(formData)

    let start = new Date(startDate)
    let finish = new Date(finishDate)

    if (startDate.length != 0) {
        if (!start) { return json({ errors: { start_notValidFormat: 'Написан же пример записи, ты совсем тупой?' } }) }
        else if (start < Date.now()) { return json({ errors: { start_notValidTime: 'Да я смотрю ты живешь в прошлом' } }) }
        try {
            await prisma.event.update({
                where: {
                    id: 1
                },
                data: {
                    startDate: start
                },
            })

            return json({ok: true})

        } catch (err) {
            console.log(err)
            return json({ error: { message: 'Some error. Fix me' } })
        }
    }
    else if (finishDate.length != 0) {
        if (!finish) { return json({ errors: { finish_notValidFormat: 'Написан же пример записи, ты совсем тупой?' } }) }
        else if (finish < Date.now()) { return json({ errors: { finish_notValidTime: 'Да я смотрю ты живешь в прошлом' } }) }
        try {
            await prisma.event.update({
                where: {
                    id: 1,
                },
                data: {
                    endDate: finish
                },
            })

            return json({ok: true})

        } catch (err) {
            console.log(err)
            return json({ error: { message: 'Some error. Fix me' } })
        }
    }

    return redirect('/admin/settings')
}

export default function EventPage() {
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
                    placeholder='1939-09-01 04:30'
                    error={actionData?.errors.start_notValidFormat || actionData?.errors.start_notValidTime}
                />
                <Field
                    name='finishDate'
                    label='End Date'
                    placeholder='1945-09-02 09:04'
                    error={actionData?.errors.finish_notValidFormat || actionData?.errors.finish_notValidTime}
                />
                <Button
                    text='Update'
                    className='col-span-2 self-center justify-self-end'
                />
            </Form>
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
                    Create event
                </h2>
                <Field
                    name='eventName'
                    label='Name of event'
                    placeholder='Name'
                // error={actionData?.errors.start_notValidFormat || actionData?.errors.start_notValidTime}
                />
                <Field
                    name='eventLocation'
                    label='Location of event'
                    placeholder='Location'
                // error={actionData?.errors.finish_notValidFormat || actionData?.errors.finish_notValidTime}
                />
                <Field
                    name='eventFormat'
                    label='Format of event'
                    placeholder='Format'
                // error={actionData?.errors.finish_notValidFormat || actionData?.errors.finish_notValidTime}
                />
                {/* <Field
                    name='startDate'
                    label='Start Date'
                    placeholder='1939-09-01 04:30'
                    error={actionData?.errors.start_notValidFormat || actionData?.errors.start_notValidTime}
                />
                <Field
                    name='finishDate'
                    label='End Date'
                    placeholder='1945-00-02 09:04'
                    error={actionData?.errors.finish_notValidFormat || actionData?.errors.finish_notValidTime}
                /> */}
                {/* <Button
                    text='Create'
                    className='col-span-2 self-center justify-self-end'
                /> */}
            </Form>
        </div>

    );
}