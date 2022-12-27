import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useCatch,
    useLoaderData
} from '@remix-run/react'
import { json } from '@remix-run/node'

import prisma from '~/utils/prisma.server'
import styles from './styles/tailwind.css'
import authenticator from './utils/auth.server'

import { ServerError, NotFoundError } from './components/Errors'
import { Navbar } from './components/Navbar'

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
    let player = await authenticator.isAuthenticated(request)

    let event = await prisma.event.findUnique({ where: { id: 1 } })

    return json({ player, event })
}

export default function App() {
    let data = useLoaderData()

    return (
        <html lang='en'>
            <head>
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width,initial-scale=1' />
                <Meta />
                <Links />
                <title>{meta.title ? meta.title : 'ADMCTF'}</title>
            </head>
            <body style={{ minWidth: 320 + 'px' }} className='bg-black'>
                <Navbar user={data?.player} />
                <main>
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
    console.error('CatchBoundary', caught)

    if (caught.status === 404) {
        return (
            <html lang='en'>
                <head>
                    <title>Not Found</title>
                    <Links />
                </head>
                <body className='bg-black transition duration-500'>
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
    console.error('ErrorBoundary', error)

    return (
        <html lang='en'>
            <head>
                <title>Oh no...</title>
                <Links />
            </head>
            <body className='bg-black transition duration-500'>
                <Navbar />
                <ServerError error={error} />
                <Scripts />
            </body>
        </html>
    )
}