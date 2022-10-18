import * as React from 'react'
import clsx from 'clsx'
import { useMatches, Link } from '@remix-run/react'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { Hacker2 } from './Video'


function RedBox({ error }) {
    return (
        <Disclosure>
            {({ open }) => (
                /* Use the `open` state to conditionally change the direction of an icon. */
                <>
                    <Disclosure.Button
                        className={clsx(
                            "w-full py-2 px-4 flex flex-row justify-between items-center rounded-md bg-zinc-200 font-semibold text-xs text-zinc-800",
                            { 'bg-error rounded-b-none text-red-500': open },
                        )}
                    >
                        ERROR
                        <ChevronRightIcon className={clsx('h-5 w-5', { 'rotate-90 transform': open })} strokeWidth={1} />
                    </Disclosure.Button>
                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Disclosure.Panel>
                            <pre className='max-h-56 text-xs pt-4 pb-8 px-4 bg-error text-error-dark overflow-auto'>
                                {error.stack}
                            </pre>
                        </Disclosure.Panel>
                    </Transition>
                </>
            )}
        </Disclosure>
    )
}


function Error({ error, errorProps, image }) {
    return (
        <>
            <noscript>
                <div
                    style={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: 30,
                    }}
                >
                    <h1 style={{ fontSize: '2em' }}>{errorProps.title}</h1>
                    <p style={{ fontSize: '1.5em' }}>{errorProps.subtitle}</p>
                    <small>
                        Also, this site works much better with JavaScript enabled...
                    </small>
                </div>
            </noscript>

            <main className="mt-14 p-10 container w-full max-w-5xl mx-auto">
                <div className='w-full flex flex-col md:flex-row justify-between items-start'>
                    <div className='pb-8 md:p-0'>
                        <h2 className='text-9xl font-bold'>
                            {errorProps.code}
                        </h2>
                        <h1 className='mt-8 text-2xl font-semibold'>
                            {errorProps.title}
                        </h1>
                        <p className='mt-4 text-gray-600'>
                            {errorProps.subtitle}
                        </p>
                    </div>
                    {image
                        ? (
                            <div className='md:px-8'>
                                {/* <Hacker className='w-full' /> */}
                                {image}
                            </div>
                        )
                        : null
                    }
                </div>

                {
                    error && process.env.NODE_ENV === 'development'
                        ? (
                            <div className='mt-8'>
                                <RedBox error={error} />
                            </div>
                        )
                        : null
                }
            </main>
        </>
    )
}

function NotFoundError() {
    const matches = useMatches()
    const last = matches[matches.length - 1]
    const pathname = last?.pathname

    return (
        <Error
            errorProps={{
                code: '404',
                title: "Oh no, you found a page that's missing stuff.",
                subtitle: `"${pathname}" is not a page on admctf.ru. So sorry.`,
            }}
            image={<Hacker />}
        />
    )
}

function ServerError({ error }) {
    const matches = useMatches()
    const last = matches[matches.length - 1]
    const pathname = last?.pathname

    return (
        <Error
            error={error}
            errorProps={{
                code: '500',
                title: 'Oh no, something did not go well.',
                subtitle: `The page you're looking for is currently not working. Return to the home page and remember: you have't seen anything.`,
            }}
            image={<Hacker2 />}
        />
    )
}

export { Error, ServerError, NotFoundError }