import {
    Links,
    Link,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
    useCatch,
    useLoaderData
} from '@remix-run/react'
import { json } from '@remix-run/node'
import { clsx } from 'clsx'

import prisma from '~/utils/prisma.server'
import  Timer  from '~/components/Timer'
import styles from './styles/tailwind.css'
import authenticator from './utils/auth.server'
import { ServerError, NotFoundError } from './components/Errors'
import { Navbar, Profile, Navigation } from './components/Navbar'
import { Button } from '~/components/Button'

export const meta = () => ({
    charset: 'utf-8',
    title: 'ADMCTF',
    viewport: 'width=device-width,initial-scale=1',
});

export function links() {
    return [
        { rel: 'stylesheet', href: styles }
    ]
}

export async function loader({ request }) {
    let session = await authenticator.isAuthenticated(request)

    let start = await prisma.settings.findUnique({
        where: {
            name: "start"
        }
    })
    let finish = await prisma.settings.findUnique({
        where: {
            name: "finish"
        }
    })

    return json({ session, start, finish })
};

export default function App() {
    let data = useLoaderData()
    let location = useLocation()
    return (
        <html lang='en' theme='dark'>
            <head>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width,initial-scale=1' />
                <Meta />
                <Links />
                <title>{meta.title ? title : 'ADMCTF'}</title>
            </head>
            <body style={{ minWidth: 320 + 'px' }}>
                {location.pathname.includes('sign') || location.pathname.includes('login')
                    ? null
                    : (
                        <Navbar color={location.pathname === '/' ? 'bg-black' : null}>
                            <Navigation />
                            <Timer 
                            start={data.start.value}
                            finish={data.finish.value}
                            />
                            {data.player
                                ? <Profile player={data.player} />
                                : (
                                    <Link
                                        to='/tasks'
                                        className='mr-4 flex items-center'
                                    >
                                        <Button text='Play' />
                                    </Link>
                                )
                            }
                        </Navbar>
                    )
                }

                <main className='mt-14'>
                    <Outlet />
                </main>

                {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html >
    );
}

export function CatchBoundary() {
    const caught = useCatch()
    const location = useLocation()
    console.error('CatchBoundary', caught)
    if (caught.status === 404) {
        return (
            <html lang='en' theme='dark'>
                <head>
                    <title>Not Found</title>
                    <Links />
                </head>
                <body className='bg-white transition duration-500'>
                    <Navbar />
                    <NotFoundError />
                    <Scripts />
                </body>
            </html>
        )
    }
    throw new Error(`Unhandled error: ${caught.status}`)
}

export function ErrorBoundary({ error }) {
    console.error(error)
    const location = useLocation()
    return (
        <html lang='en' className='dark'>
            <head>
                <title>Oh no...</title>
                <Links />
            </head>
            <body>
                <Navbar />
                <ServerError error={error} />
                <Scripts />
            </body>
        </html>
    )
}