import * as React from 'react'
import Typist from 'react-typist'

import { MakaraIcon } from '~/components/icons/MakaraIcon'
import authenticator from '~/utils/auth.server'

export async function action({ request }) {
    return await authenticator.logout(request, { redirectTo: '/sign-in', })
}

export default function RootPage() {
    const [isTypingDone, setTypingDone] = React.useState(0)

    // is it possible not to use useEffect???
    React.useEffect(() => {
        setTypingDone(0)
    }, [isTypingDone])

    return (
        <div className='absolute top-0 left-0 w-full min-h-screen bg-black'>
            <div className='py-24 px-8 grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 gap-6 max-w-5xl mx-auto'>
                <div className='p-5 flex justify-center'>
                    <MakaraIcon className='w-full h-auto max-w-xs' />
                </div>
                <div className='lg:order-first'>
                    <h1 className='h-48 text-white text-6xl font-bold uppercase'>
                        {isTypingDone ? '' : (
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
                                <Typist.Delay ms={1000} />
                            </Typist>
                        )}
                    </h1>
                    <p className='text-red-500 my-24'>Начало - Конец</p>
                </div>
            </div>
        </div>
    )
}

export function ErrorBoundary({ error }) {
    console.error(error)
    return <ServerError error={error} />
}