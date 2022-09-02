import { useMatches, Link } from '@remix-run/react'
import * as React from 'react'
import errorStack from 'error-stack-parser'
import clsx from 'clsx'


function RedBox({ error }) {
    const [isVisible, setIsVisible] = React.useState(true)
    const frames = errorStack.parse(error)

    return (
        <div
            className={clsx(
                'fixed inset-0 z-10 flex items-center justify-center transition',
                {
                    'pointer-events-none opacity-0': !isVisible,
                },
            )}
        >
            <button
                className="absolute inset-0 block h-full w-full bg-black opacity-75"
                onClick={() => setIsVisible(false)}
            />
            <div className="border-lg text-primary relative mx-5vw my-16 max-h-75vh overflow-y-auto rounded-lg bg-red-500 p-12">
                <h2>{error.message}</h2>
                <div>
                    {frames.map(frame => (
                        <div
                            key={[frame.fileName, frame.lineNumber, frame.columnNumber].join(
                                '-',
                            )}
                            className="pt-4"
                        >
                            <h6 as="div" className="pt-2">
                                {frame.functionName}
                            </h6>
                            <div className="font-mono opacity-75">
                                {frame.fileName}:{frame.lineNumber}:{frame.columnNumber}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


function ErrorPage({ error, errorProps }) {
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
            <main className="relative">
                {error && process.env.NODE_ENV === 'development' ? (
                    <RedBox error={error} />
                ) : null}

                <div>
                    <h1>{errorProps.title}</h1>
                    <p>{errorProps.subtitle}</p>
                    {errorProps.action ? errorProps.action: null}
                </div>
            </main>
        </>
    )
}

function FourOhFour() {
    const matches = useMatches()
    const last = matches[matches.length - 1]
    const pathname = last?.pathname

    return (
        <ErrorPage
            errorProps={{
                title: "404 - Oh no, you found a page that's missing stuff.",
                subtitle: `"${pathname}" is not a page on admctf.ru. So sorry.`,
                action: <Link to='/'>Go home</Link>
            }}
        />
    )
}

function ServerError({error}){
    const matches = useMatches()
    const last = matches[matches.length - 1]
    const pathname = last?.pathname

    return (
        <ErrorPage
            error={error}
            errorProps={{
                title: '500 - Oh no, something did not go well.',
                subtitle: `"${pathname}" is currently not working. So sorry.`,
            }}
        />
    )
}

export { ErrorPage, ServerError, FourOhFour }