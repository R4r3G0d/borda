import { AuthorizationError } from 'remix-auth'
import {
    Form,
    Link,
    useActionData,
    useTransition
} from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { z } from 'zod'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { MakaraIcon } from '~/components/icons/MakaraIcon'
import { EmailInput } from '~/components/Input'

export const loader = async ({ request }) => {
    return await authenticator.isAuthenticated(request, {
        successRedirect: "/tasks"
    });
};

export async function action({ request }) {
    let formData = await request.formData()

    let signUpInput = {
        email: formData.get('email'),
        password: formData.get('password'),
        displayName: formData.get('name'),
    }

    const validator = z.object({
        email: z.string().email(),
        password: z.string().min(5),
        displayName: z.string().min(2),
    })

    let result = validator.safeParse(signUpInput)
    if (!result.success) {
        // console.log(result)

        let errors = new Object

        let issues = result.error.issues
        issues.forEach(function (issue) {
            errors[issue.path[0]] = issue.message
        });

        // console.log({ errors })
        return json({ error: errors })
    }

    let player = await prisma.player.findUnique({
        where: {
            email: signUpInput.email,
        },
    })

    if (!player) {
        let newPlayer = await prisma.player.create({
            data: {
                ...signUpInput,
            }
        })
        if (!newPlayer) return json({ error: { message: 'Internal error. Please try again later.' } })
    } else {
        return json({ error: { message: 'This email is already in use. Please try another one.' } })
    }

    return redirect('/sign-in')
}


export default function SignUp() {
    const transition = useTransition();
    let actionData = useActionData();

    console.log({ actionData })

    return (
        <div className='min-h-screen bg-white flex flex-col'>
            <div className='w-full m-auto pt-12 flex flex-grow justify-center'>
                <Form method='post'
                    className='flex flex-col items-center p-8 max-w-sm w-full text-base text-black'
                >
                    <div className='p-4 flex justify-center'>
                        <MakaraIcon className={'w-56 h-56'} />
                    </div>

                    <div className='min-h-8'>
                        {actionData?.error ? <p>{actionData?.error?.message}</p> : null}
                        {actionData?.error ? <p>{actionData?.error?.password}</p> : null}
                        {actionData?.error ? <p>{actionData?.error?.email}</p> : null}
                    </div>

                    {/* <InputEmail/> */}
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className='w-full h-12 px-3 mt-4 border-4 focus-ring rounded-lg border-blue-900'>
                    </input>

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className='w-full h-12 px-3 mt-4 border-2 focus-ring rounded-lg text-black border-black focus:border-blue-800'
                    >
                    </input>

                    <input
                        name="name"
                        type="name"
                        placeholder="Name"
                        className='w-full h-12 px-3 mt-4 border-2 focus-ring rounded-lg text-black border-black focus:border-blue-800'
                    >
                    </input>

                    <button
                        type='submit'
                        className={`w-full h-12 px-5 mt-4 rounded-lg ${transition.submission ? 'bg-gray-700' : 'bg-black'}  text-white text-lg`}
                        disabled={transition.submission}
                    >
                        {transition.submission
                            ? 'Creating account...'
                            : 'Create account'}

                    </button>


                    <div className="h-16 flex items-center place-content-center">
                        Already have an account?
                        <Link to="/sign-in" className="pl-3 text-indigo-700">Sign in</Link>
                    </div>
                </Form>
            </div>

        </div>
    )
}