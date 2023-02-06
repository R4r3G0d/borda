import * as React from 'react'
import {
    Form,
    useActionData,
    useLoaderData,
} from '@remix-run/react'
import {
    json,
    redirect,
} from '@remix-run/node'
import z from 'zod'

import prisma from '~/utils/prisma.server'
import { Button } from '~/components'
import { Field } from '~/components/Field'

export async function action({ request }) {
    const formData = await request.formData()

    let { start, end } = Object.fromEntries(formData)

    shema = z.date()

    if (!shema.safeParse(start).sucess && !shema.safeParse(end).sucess) {
        return json({ error: { startDate: "Мега долбаеб" } })
    };

    let startDate = new Date(start)
    let endDate = new Date(end)

    console.log(startDate, startDate)
    if (!startDate || !endDate) {
        // проверка на то где ииммено было ошибка
        return json({ error: { startDate: "Ну ты кончь" } })
    }

    if (startDate > endDate) {
        return json({ error: { startDate: "Ты долбаеб" } })
    }

    let data = {}

    if (startDate.length != 0 && !startDate) {
        data.startDate = startDate
    }

    await prisma.event.update({
        where: {
            id: 1,
        },
        data: {
            endDate: endDate,
            startDate: startDate
        },
    })

    return redirect('/admin/settings')
}

export default function EventPage() {
    const [disabled, setDisabled] = React.useState(true)
    let { event } = useLoaderData();
    let actionData = useActionData();

    return (
        <>
            <div className='p-5 w-full max-w-2xl'>
                <h2 className='py-2 text-xl text-white'>
                    Settings
                </h2>
                <Form
                    reloadDocument
                    replace
                    method='post'
                    className='pt-5 pb-10 grid grid-cols-2 gap-5'
                >
                    <h2 className='col-span-2 py-2 text-lg text-white border-b border-white/30'>
                        Event dates
                    </h2>
                    <Field
                        name='start'
                        label='Start Date'
                        placeholder='1939-09-01 04:30'
                        defaultValue={event.startDate}
                        error={actionData?.error.startDate}
                    />
                    <Field
                        name='end'
                        label='End Date'
                        placeholder='1945-09-02 09:04'
                        defaultValue={event.endDate}
                        error={actionData?.error.endDate}
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
                        Event info
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
                    name='end'
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
        </>
    );
}

export async function loader() {
    let event = await prisma.event.findUnique({ where: { id: 1 } })
    return json({ event })
}