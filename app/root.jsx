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
} from "@remix-run/react";
import { json } from "@remix-run/node";

import styles from "./styles/tailwind.css";
import authenticator from "./utils/auth.server";

import { FourOhFour, ServerError } from "./components/Errors";
import { Navbar, Profile, Navigation } from "./components/Navbar";

export const meta = () => ({
    charset: "utf-8",
    title: "ADMCTF",
    viewport: "width=device-width,initial-scale=1",
});

export function links() {
    return [
        { rel: "stylesheet", href: styles }
    ]
}

export async function loader({ request }) {
    let session = await authenticator.isAuthenticated(request)

    return json({ player: session })    
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
            <body>
                {location.pathname.includes('sign')
                    ? null
                    : (
                        <Navbar>
                            <Navigation />
                            <div className='flex-auto text-center px-4 text-red-500 text-sm justify-self-center'>Timer</div>
                            {data.player
                                ? <Profile player={data.player} />
                                : (
                                    <Link
                                        to="/tasks"
                                        className='px-8 py-2 inline-block text-black bg-white focus:ring-4 focus:outline-none focus:ring-grey font-medium rounded-lg text-lg  text-center'
                                    >
                                        Play
                                    </Link>
                                )
                            }
                        </Navbar>
                    )
                }

                <Outlet />
                {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html >
    );
}

// export function CatchBoundary() {
//     const caught = useCatch()
//     const location = useLocation()
//     console.error('CatchBoundary', caught)
//     if (caught.status === 404) {
//         return (
//             <html lang="en" className="dark">
//                 <head>
//                     <title>Oh no...</title>
//                     <Links />
//                 </head>
//                 <body className="bg-white transition duration-500 dark:bg-gray-900">
//                     <FourOhFour/>
//                     <Scripts />
//                 </body>
//             </html>
//         )
//     }
//     throw new Error(`Unhandled error: ${caught.status}`)
// }

export function ErrorBoundary({ error }) {
    console.error(error)
    const location = useLocation()
    return (
        <html lang="en" className="dark">
            <head>
                <title>Oh no...</title>
                <Links />
            </head>
            <body>
                <ServerError error={error} />
                <Scripts />
            </body>
        </html>
    )
}