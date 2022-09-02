import * as React from 'react'
import { Link, useLoaderData } from "@remix-run/react";
import Typist from 'react-typist';
import { MakaraIcon } from '~/components/icons/MakaraIcon';
import authenticator from '~/utils/auth.server';

export const loader = async ({ request }) => {
    return await authenticator.isAuthenticated(request, {
        failureRedirect: "/login"
    });
};

export default function RootPage() {
    const data = useLoaderData();
    console.log(data)

    const [isTypingDone, setTypingDone] = React.useState(0);

    // is it possible not to use useEffect???
    React.useEffect(() => {
        setTypingDone(0);
    }, [isTypingDone]);

    return (
        <div className='min-h-screen bg-black'>
            <div className='flex justify-between px-8 py-6'>
                <MakaraIcon size={48} />
                <Link
                    to="/play"
                    className='px-10 py-3 inline-block text-black bg-white focus:ring-4 focus:outline-none focus:ring-grey font-medium rounded-lg text-lg  text-center'
                >
                    Play
                </Link>
            </div>
            <div className='py-12 md:py-16 px-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full m-auto'>
                <div className='p-5'>
                    <MakaraIcon size={228} />
                </div>
                <div className='md:order-first'>
                    <h1 className='h-48 text-white text-6xl font-bold uppercase'>
                        {isTypingDone ? "" : (
                            <Typist avgTypingDelay={100} cursor={{ blink: true, }} onTypingDone={() => setTypingDone(0)}>
                                <span>adm</span><br />
                                <Typist.Delay ms={100} />

                                <span>makarov</span><br />
                                <Typist.Delay ms={1000} />

                                <span>stf </span>
                                <Typist.Backspace count={4} delay={1000} />

                                <span> ctf </span>
                                <Typist.Delay ms={100} />

                                <span>2022.</span>
                                <Typist.Delay ms={1000} />
                            </Typist>
                        )}
                    </h1>
                    <p className='text-red-500 my-24'>Начало - Конец</p>
                    <Link
                        to="/play"
                        className='px-10 py-3 inline-block text-black bg-white focus:ring-4 focus:outline-none focus:ring-grey font-medium rounded-lg text-lg  text-center'
                    >
                        Play
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function ErrorBoundary({error}) {
    console.error(error)
    return <ServerError error={error} />
  }