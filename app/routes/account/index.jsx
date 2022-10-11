import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { z } from "zod";

import authenticator from '~/utils/auth.server';
import prisma from '~/utils/prisma.server'
import Input from '~/components/Input'
import { validatePassword } from '~/utils/auth.server'

export async function action({ request }) {
    let user = await authenticator.isAuthenticated(request);
    const formData = await request.formData()

    let input = {
        oldPassword: formData.get('password-old'),
        password: formData.get('password-new'),
        passwordRepeat: formData.get('password-repeat'),
    }

    let action = formData.get('_action')
    console.log({ action, input })


    switch (action) {
        case 'updateProfile':
            try {
                let updatePlayer = await prisma.player.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        displayName: formData.get('Nickname'),
                    },
                })
                console.log(updatePlayer)
                return redirect('/account')

            } catch (err) {
                console.log(err)
                return json({ error: { message: "Some error. Fix me" } })
            };
        case 'updatePassword':
            {
                let validator = z.string()
                let result = validator.safeParse(input.oldPassword)

                let user = prisma.player.find
                let match = await validatePassword(input.oldPassword, user.password)

                console.log({ match })

                if (input.password !== input.passwordRepeat) {
                    return json({ error: { message: "Passwords are not simular. Please try again!" } })
                }
            };

            return redirect('./')
    };


    // let newpass = user.password;
    //if (formData.get('password') == user.password && (formData.get('newpassword') == formData.get('checknewpassword'))) { newpass = formData.get('newpassword') }
    //if (formData.get('Current password') !== user.password && (formData.get('Current password')).lenght > 0) throw new AuthorizationError('Password is not correct. Try again')

}

export async function loader({ request }) {
    let player = await authenticator.isAuthenticated(request);

    console.log(player)

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
                                    name='Email'
                                    id='email'
                                    defaultValue={player.email}
                                    readonly
                                />
                            </div>

                            <div class='w-full md:w-1/2 px-3 mb-6'>
                                <Input
                                    name='Nickname'
                                    id='nickname'
                                    defaultValue={player.displayName}
                                />
                            </div>
                            <div class='w-full md:w-1/2 px-3 mb-6'>
                                <Input
                                    name='TelegramID'
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
                                    id='password'
                                    type='password'
                                />
                            </div>
                            <div class='pt-8 w-1/2 px-3'>
                                <Input
                                    name='password-new'
                                    id='newPassword'
                                    type='password'
                                />
                            </div>
                            <div class='w-1/2 px-3'>
                                <Input
                                    name='password-repeat'
                                    id='checknewPassword'
                                    type='password'
                                    errorMessage={actionData?.error.message}
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