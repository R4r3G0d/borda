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
import { Button } from '~/components/Button'
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
        <>
            <h2 className='py-4 text-2xl text-gray-900  border-b border-gray-300'>
                AdminKa
            </h2>
            <Form
                reloadDocument
                replace
                method='post'
                onChange={function (e) {
                    if (actionData.start.length!=0||actionData.finish.length!=0) {
                        setDisabled(false)
                    } else { setDisabled(true) }
                }}
                className='flex flex-wrap py-5'
            >
                <div className='pr-3'>
                    Сюда пишем начало:
                    <Field
                        className='w-64'
                        name='startDate'
                        placeholder='2020-09-25 18:36'
                        error={actionData?.errors.start_notValidFormat || actionData?.errors.start_notValidTime}
                    />
                </div>

                <div className='px-3'>
                    Сюда пишем конец:
                    <Field
                        className='w-64'
                        name='finishDate'
                        placeholder='2020-09-25 18:36'
                        error={actionData?.errors.finish_notValidFormat || actionData?.errors.finish_notValidTime}
                    />
                    <Button
                        text='Update'
                        name='_action'
                        value='updateFinish'
                        disabled={disabled}
                    />
                </div>

                <div className='px-3'>
                    Сюда еще что то:
                    <Field
                        className='w-64'
                    />
                </div>
                <Button
                    text='Update'
                    name='_action'
                />
            </Form>
            {/* </div> */}
        </>
    );
}