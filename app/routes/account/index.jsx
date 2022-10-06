import { AuthorizationError } from 'remix-auth';
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { json, redirect } from "@remix-run/node";
import authenticator from '~/utils/auth.server';
import prisma from '../../utils/prisma.server'

export async function action({ request }) {
    let user = await authenticator.isAuthenticated(request);
    const formData = await request.formData()

    //let newpass = user.password;
    //if (formData.get('password') == user.password && (formData.get('newpassword') == formData.get('checknewpassword'))) { newpass = formData.get('newpassword') }

    try {
        let updatePlayer = await prisma.player.update({
            where: {
                id: user.id,
            },
            data: {
                displayName: formData.get('name'),
                // password: newpass,
            },
        })

        console.log(updatePlayer)

        return redirect('/account')

    } catch (err) {
        console.log(err)
        return json({ error: { message: "Some error. Fix me" } })
    }

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
                        <div class='flex flex-wrap -mx-3 mb-6'>
                            <div class='w-full px-3 mb-6'>
                                <label class='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
                                    email
                                </label>
                                <input
                                    type='email'
                                    name='email'
                                    defaultValue={player.email}
                                    class='appearance-none block w-full bg-white border border-gray-400 shadow-inner rounded-md py-3 px-2 leading-tight focus:outline-none  focus:border-gray-500'
                                />
                            </div>

                            <div class='w-full md:w-1/2 px-3 mb-6'>
                                <label class='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
                                    nickname
                                </label>
                                <input
                                    type='text'
                                    name='name'
                                    class='appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-2 leading-tight focus:outline-none  focus:border-gray-500'
                                    placeholder='Display name'
                                    defaultValue={player.displayName}
                                />
                                {actionData?.error ? (
                                    <div className='pb-2'>
                                        <div className='bg-red-100 text-red-500 rounded-md h-10 flex items-center w-full'>
                                            <p className='px-3'>
                                                {actionData.error.message}
                                            </p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <div class='w-full md:w-1/2 px-3 mb-6'>
                                <label class='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
                                    telegram
                                </label>
                                <input
                                    type='text'
                                    name='telegram'
                                    class='appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-2 leading-tight focus:outline-none  focus:border-gray-500'
                                    placeholder={"https://t.me/nickname"} />
                            </div>
                            <h2 class="text-2xl text-gray-900 w-full px-3 mb-4 border-b pb-4 border-gray-400">Privacy Setting</h2>
                            <div class='w-full px-3 mb-6'>
                                <div class='pt-4 w-1/2'>
                                    <label class='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>old password</label>
                                    <input
                                        class='appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-2 leading-tight focus:outline-none  focus:border-gray-500'
                                        type='password' />
                                    <div>
                                        {loaderData?.error ? <p>ERROR: {loaderData?.error?.message}</p> : null}
                                    </div>
                                </div>
                                <div class='pt-12 w-1/2'>
                                    <label class='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>new password</label>
                                    <input
                                        class='appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-2 leading-tight focus:outline-none  focus:border-gray-500'
                                        type='password'
                                        name='newpassword' />
                                </div>
                                <div class='pt-4 w-1/2'>
                                    <label class='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>repeat new password</label>
                                    <input
                                        class='appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-2 leading-tight focus:outline-none  focus:border-gray-500'
                                        type='password'
                                        name='checknewpassword' />
                                </div>
                            </div>
                            <div class='w-full relative'>
                                <button
                                    type="submit"
                                    class="bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md absolute right-0"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}