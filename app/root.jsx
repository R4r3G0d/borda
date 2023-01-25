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
import styles from './styles/index.css'
import authenticator from './utils/auth.server'

import { ServerError, NotFoundError } from './components/Errors'
import { Footer, Navbar } from "~/components";

export const meta = () => ({
    charset: 'utf-8',
    title: 'CTFBOARD',
    viewport: 'width=device-width,initial-scale=1',
});

export function links() {
    return [
        { rel: 'stylesheet', href: styles }
    ]
}

export async function loader({ request }) {
    let player = await authenticator.isAuthenticated(request)
    return json({ player })
}

export default function App() {
    let { player } = useLoaderData()

    return (
        <html lang='en'>
            <head>
                <Meta />
                <Links />
            </head>
            <body className='bg-black min-w-xs min-h-screen flex flex-col'>
                <Navbar user={player} />
                <main className='min-h-screen'>
                    <Outlet />
                </main>
                <Footer />
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
    throw new Error(`Unhandled error: ${caught.status} `)
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