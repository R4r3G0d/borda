import { AuthorizationError } from 'remix-auth';
import { Form, Link, useLoaderData, useTransition } from '@remix-run/react';
import { json, redirect } from "@remix-run/node";
import prisma from '~/utils/prisma.server';
import authenticator from '~/utils/auth.server';
import { MakaraIcon } from '~/components/icons/MakaraIcon'

export const loader = async ({ request }) => {
    return await authenticator.isAuthenticated(request, {
        successRedirect: "/tasks"
    });
};

export const action = async ({ request, context }) => {
    let form = await request.formData()
    let email = form.get('email')
    let name = form.get('name')
    let password = form.get('password')

    if (!email || email?.length === 0) throw new AuthorizationError('Bad Credentials: Email is required')
    if (typeof email !== 'string') throw new AuthorizationError('Bad Credentials: Email must be a string')
    if (!name || name?.length === 0) throw new AuthorizationError('Bad Credentials: Name is required')
    if (typeof name !== 'string') throw new AuthorizationError('Bad Credentials: Name must be a string')
    if (!password || password?.length === 0) throw new AuthorizationError('Bad Credentials: Password is required')
    if (typeof password !== 'string') throw new AuthorizationError('Bad Credentials: Password must be a string')

    // By unique identifier
    let player = await prisma.player.findUnique({
        where: {
            email: email,
        },
    })

    if (player) throw new AuthorizationError('Bad Credentials: Player alredy exist')

    let newPlayer = await prisma.player.create({
        data: {
            email: email,
            displayName: name,
            password: password
        }
    })

    if (!newPlayer) throw new AuthorizationError("Create")


    return redirect('/sign-in')
};


export default function SignupPage() {
    const loaderData = useLoaderData();
    const transition = useTransition();

    return (
        <div className='min-h-screen bg-white flex flex-col'>
            <div className='w-full m-auto pt-12 flex flex-grow justify-center'>
                <Form method='post'
                    className='flex flex-col items-center p-8 max-w-sm w-full text-base text-black'
                >
                    <div className='p-4 flex justify-center'>
                        <MakaraIcon className={'w-56 h-56'}/>
                    </div>

                    <div className='h-4'></div>
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
                        className={`w-full h-12 px-5 mt-4 rounded-lg ${transition.submission ? 'bg-gray-700': 'bg-black' }  text-white text-lg`}
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
                    <div>
                        {loaderData?.error ? <p>ERROR: {loaderData?.error?.message}</p> : null}
                    </div>

                </Form>
            </div>

        </div>
    )
}