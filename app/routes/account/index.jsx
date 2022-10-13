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
import { validatePassword, hashPassword } from '~/utils/auth.server'
import { getSession, commitSession } from '~/utils/session.server'
import { passwordValidator } from '~/utils/validator'
import { Button } from '~/components/Button'
import { EmailField, Field, PasswordField } from '~/components/Field'

export async function action({ request }) {
    let user = await authenticator.isAuthenticated(request)

    const formData = await request.formData()

    let { _action, ...values } = Object.fromEntries(formData)

    console.log(_action, values)

    switch (_action) {
        case 'updateProfile':
            try {
                await prisma.player.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        // TODO: check format
                        displayName: values.displayName
                    },
                })

                user.displayName = values.displayName

                const session = await getSession(request.headers.get('Cookie'))
                session.set(authenticator.sessionKey, user)

                return redirect('/account', { headers: { 'set-cookie': await commitSession(session) } })

            } catch (err) {
                console.log(err)
                return json({ error: { message: 'Some error. Fix me' } })
            }
        case 'updatePassword':
            let validator = z.object({
                password: passwordValidator,
                // password: z.string().min(6, { message: 'Password must be at least 6 characters!' }),
                passwordNew: passwordValidator,
                passwordRepeat: passwordValidator
            })

            let result = validator.safeParse(values)
            if (!result.success) {
                console.log(result)

                let errors = new Object

                let issues = result.error.issues
                issues.forEach(function (issue) {
                    errors[issue.path[0]] = issue.message
                });

                // console.log({ errors })
                return json({ errors: errors })
            }

            try {
                let player = await prisma.player.findUnique({
                    where: { id: user.id, },
                })

                let match = await validatePassword(values.password, player.password)
                let passwordsIsEqual = (values.password == values.passwordRepeat)

                if (match && passwordsIsEqual) {
                    let hasedPassword = hashPassword(values.passwordRepeat)

                    await prisma.player.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            password: hasedPassword,
                        },
                    })

                    delete player.password
                    return redirect('./account')
                }
                else {
                    if (!match) {
                        return json({ errors: { password: 'Password is incorrect!' } })
                    } else {
                        return json({
                            errors: {
                                passwordNew: 'Passwords do not match!',
                                passwordRepeat: 'Passwords do not match!',
                            },
                        })
                    }
                }
            } catch (err) {
                console.log({ err })
                return json({ error: { message: 'Some error. Fix me' } })
            }
    };


}

export async function loader({ request }) {
    let player = await authenticator.isAuthenticated(request);

    return json({ player })
}

export default function Profile() {
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

    let { player } = useLoaderData()
    let actionData = useActionData()

    return (
        <div className='container w-full max-w-2xl mx-auto sm:px-6'>
            <h2 className='py-4 text-2xl text-gray-900  border-b border-gray-300'>
                Account Setting
            </h2>
            <Form
                reloadDocument
                replace
                method='post'
                onChange={function (e) {
                    if (player.displayName !== e.target.value) {
                        setDisabled(false)
                    } else { setDisabled(true) }
                }}
                className='flex flex-wrap  justify-end py-5'
            >
                <EmailField defaultValue={player.email} readOnly />

                <div className='w-full flex flex-row justify-between'>
                    <Field
                        name='displayName'
                        label='Display Name'
                        defaultValue={player.displayName}
                    />
                    <Field
                        name='telegram'
                        label='Telegram'
                        readOnly
                        defaultValue={player.telegramId}
                        placeholder={'https://t.me/nickname'}
                        className={'ml-8'}
                    />
                </div>

                <Button
                    text='Save'
                    name='_action'
                    value='updateProfile'
                    disabled={disabled}
                />
            </Form>

            <h2 className='py-4 text-2xl text-gray-900  border-b border-gray-300'>
                Privacy Setting
            </h2>
            <Form
                method='post'
                action='/account?index'
                replace
                className='flex flex-wrap justify-end py-5'
            >
                <div className='w-full flex flex-row justify-between'>

                    <PasswordField error={actionData?.errors.password} />

                    <div className='w-full ml-8'>
                        <PasswordField
                            key={1}
                            name='passwordNew'
                            label='New password'
                            error={actionData?.errors.passwordNew}
                        />
                        <PasswordField
                            key={2}
                            name='passwordRepeat'
                            label='Repeat password'
                            error={actionData?.errors.passwordRepeat}
                        />
                    </div>
                </div>

                <Button
                    text='Update'
                    name='_action'
                    value='updatePassword'
                />
            </Form>
            {/* </div> */}
        </div>
    );
}