import { Form, Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { MakaraIcon } from '~/components/icons/MakaraIcon'
import authenticator from '~/utils/auth.server';
import { sessionStorage } from '~/utils/session.server';

export const loader = async ({ request }) => {
    await authenticator.isAuthenticated(request, {
        successRedirect: "/tasks"
    });

    const session = await sessionStorage.getSession(
        request.headers.get("Cookie")
    );

    const error = session.get("sessionErrorKey");
    return json({ error });
};

export const action = async ({ request, context }) => {
    // call my authenticator
    const resp = await authenticator.authenticate("form", request, {
        successRedirect: "/tasks",
        failureRedirect: "/sign-in",
        throwOnError: true,
        context,
    });
    console.log(resp);
    return resp;
};

export default function LoginPage() {
    const loaderData = useLoaderData();

    return (
        <div className='min-h-screen bg-white flex flex-col'>
            <div className='w-full m-auto pt-12 flex flex-grow justify-center'>
                <Form method='post'
                    className='flex flex-col items-center p-8 max-w-sm w-full text-base text-black'
                >
                    <div className='p-4 flex justify-center'>
                        <MakaraIcon className={'w-56 h-56'} />
                    </div>

                    <div className='h-4'></div>
                    <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        autocomplete="email"
                        required
                        className='w-full h-12 px-3 mt-4 border-4 focus-ring rounded-lg border-blue-900'>
                    </input>

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        autocomplete="password"
                        className='w-full h-12 px-3 mt-4 border-2 focus-ring rounded-lg text-black border-black focus:border-blue-800'
                    >
                    </input>

                    <button className='w-full h-12 px-5 mt-4 rounded-lg bg-black text-white text-lg'>
                        Sign In
                    </button>


                    <div className="h-16 flex items-center place-content-center">
                        No account?
                        <Link to="/sign-up" className="pl-3 text-indigo-700">Create new one</Link>
                    </div>
                    <div>
                        {loaderData?.error ? <p>ERROR: {loaderData?.error?.message}</p> : null}
                    </div>

                </Form>
            </div>

        </div>
    )
}