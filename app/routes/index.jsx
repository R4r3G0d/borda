import * as React from 'react'
import { Link, useLoaderData } from "@remix-run/react";
import Typist from 'react-typist';

import { MakaraIcon } from '~/components/icons/MakaraIcon';
import authenticator from '~/utils/auth.server';

export async function action({ request }) {
    return await authenticator.logout(request, { redirectTo: "/sign-in", });
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
            <div className='py-12 md:py-16 px-8 grid grid-cols-1 grid-rows-2 md:grid-cols-2 gap-6 max-w-5xl w-full m-auto'>
                <div className='p-5'>
                    <MakaraIcon className={'w-full h-auto max-w-xs'} />
                </div>
                <div className='md:order-first'>
                    <h1 className='h-48 text-white text-6xl font-bold uppercase'>
                        {isTypingDone ? "" : (
                            <Typist avgTypingDelay={100} cursor={{ blink: true, }} onTypingDone={() => setTypingDone(1)}>
                                <span>admiral</span><br />
                                <Typist.Delay ms={100} />

                                <span>makarov</span><br />
                                <Typist.Delay ms={1000} />

                                <span>stf </span>
                                <Typist.Backspace count={4} delay={1000} />

                                <span> ctf </span>
                                <Typist.Delay ms={100} />

                                <span className='whitespace-nowrap'>2022🚩</span>
                                {/* <FlagIcon className='w-16 h-16' strokeWidth={1}/> */}
                                <Typist.Delay ms={1000} />
                            </Typist>
                        )}
                    </h1>
                    <p className='text-red-500 my-24'>Начало - Конец</p>
                </div>
            </div>
        </div>
    );
}

export function ErrorBoundary({ error }) {
    console.error(error)
    return <ServerError error={error} />
}