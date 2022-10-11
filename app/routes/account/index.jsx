import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { json, redirect, createCookieSessionStorage } from "@remix-run/node";

import prisma from '~/utils/prisma.server'
import Input from '~/components/Input'
import authenticator from '~/utils/auth.server'
import { validatePassword, hashPassword } from '~/utils/auth.server'
import { getSession, commitSession } from '~/utils/session.server'
import { passwordValidator } from '~/utils/validator'

export async function action({ request }) {
    let user = await authenticator.isAuthenticated(request);
    const formData = await request.formData()

    let input = {
        oldPassword: formData.get('password-old'),
        password: formData.get('password-new'),
        passwordRepeat: formData.get('password-repeat')
    }
    let result = {
        oldPassword: passwordValidator.safeParse(input.oldPassword),
        password: passwordValidator.safeParse(input.password),
        passwordRepeat: passwordValidator.safeParse(input.passwordRepeat)
    }

    let formAction = formData.get('_action')
    console.log({ formAction, input })


    switch (formAction) {
        case 'updateProfile':
            try {
                await prisma.player.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        displayName: formData.get('nickname')
                    },
                })
                let updatedPlayer = await prisma.player.findUnique({
                    where: {
                        id: user.id
                    },
                    include: { team: { select: { id: true, name: true } } }
                }
                )
                delete updatedPlayer.password
                let session = await getSession(request.headers.get('Cookie'))
                session.set(authenticator.sessionKey, updatedPlayer)
                console.log(updatedPlayer)
                return redirect('/account', { headers: { 'set-cookie': await commitSession(session) } })

            } catch (err) {
                console.log(err)
                return json({ error: { message: "Some error. Fix me" } })
            };
        case 'updatePassword':
            {
                if (!result.oldPassword.success) return json({ error: { message1: result.oldPassword.error.issues[0].message } })

                if (!result.password.success) return json({ error: { message2: result.password.error.issues[0].message } })

                if (!result.passwordRepeat.success) return json({ error: { message3: result.passwordRepeat.error.issues[0].message } })

                const checkUser = await prisma.player.findUnique({
                    where: {
                        id: user.id,
                    },
                })
                let match = await validatePassword(input.oldPassword, checkUser.password)
                if (match && (input.password == input.passwordRepeat)) {
                    let updatePassword = await prisma.player.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            password: await hashPassword(input.passwordRepeat),
                        },
                    })
                    delete checkUser.password
                }
                else if (!match) { return json({ error: { message1: "Password are incorrect!" } }) }
                else if (input.password !== input.passwordRepeat) { return json({ error: { message3: "Passwords does not match!" } }) }

                console.log({ match })
            };

            return redirect('./account')
    };

    let action = formData.get('_action')
    console.log({ action, input })

}

export async function loader({ request }) {
    let player = await authenticator.isAuthenticated(request);

    return json({ player })
}

export default function Profile() {
    let { player, loaderData } = useLoaderData();
    let actionData = useActionData();
    let paswords = ['old password', 'new password', 'repeat new password']
    return (
        <>
            <div class="container mx-auto">
                <div class="w-full max-w-2xl p-6 mx-auto">
                    <h2 class="text-2xl text-gray-900">Account Setting</h2>
                    <Form class="mt-3" method="post">
                        <input type='hidden' name='_action' value='updateProfile' />
                        <div class='flex flex-wrap -mx-3 mb-6'>
                            <div class='w-full px-3 mb-6'>
                                <Input
                                    name='email'
                                    title='Email'
                                    id='email'
                                    defaultValue={player.email}
                                    readonly
                                />
                            </div>

                            <div class='w-full md:w-1/2 px-3 mb-6'>
                                <Input
                                    name='nickname'
                                    title='Nickname'
                                    id='nickname'
                                    defaultValue={player.displayName}
                                />
                            </div>
                            <div class='w-full md:w-1/2 px-3 mb-6'>
                                <Input
                                    name='TelegramID'
                                    title='Telegram'
                                    id='telegram'
                                    defaultValue={player.telegramId}
                                    placeholder={"https://t.me/nickname"}
                                />
                            </div>
                            <div class='w-full relative pb-12 pt-4'>
                                <button
                                    type="submit"
                                    class="bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md absolute right-0 mr-3"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </Form>
                    <h2 class="text-2xl text-gray-900 w-full px-3 mb-4 border-b pb-4 border-gray-400">Privacy Setting</h2>
                    <Form class="mt-3" method="post">
                        <input type='hidden' name='_action' value='updatePassword' />
                        <div class='w-full px-3 mb-6'>
                            <div class='w-1/2 px-3'>
                                <Input
                                    name='password-old'
                                    title='Password'
                                    id='password'
                                    type='password'
                                    errorMessage={actionData?.error.message1}
                                />
                            </div>
                            <div class='pt-8 w-1/2 px-3'>
                                <Input
                                    name='password-new'
                                    title='New password'
                                    id='newPassword'
                                    type='password'
                                    errorMessage={actionData?.error.message2}
                                />
                            </div>
                            <div class='w-1/2 px-3'>
                                <Input
                                    name='password-repeat'
                                    title='Repeat new password'
                                    id='password-repeat'
                                    type='password'
                                    errorMessage={actionData?.error.message3}
                                />
                            </div>
                        </div>
                        <div class='w-full relative pb-12 pt-4'>
                            <button
                                type="submit"
                                class="bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md absolute right-0 mr-1"
                            >
                                Update Password
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}