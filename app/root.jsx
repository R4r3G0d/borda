import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
    useCatch,
    useLoaderData
} from "@remix-run/react";
import { FourOhFour, ServerError } from "./components/Errors";
import authenticator from "./utils/auth.server";
import { Navbar } from "./components/Navbar";
import styles from "./styles/tailwind.css";
import { json } from "@remix-run/node";

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

export const loader = async ({ request }) => {
    let user = await authenticator.isAuthenticated(request);

    return json({user})
};

export default function App() {
    let data = useLoaderData()

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
                <Navbar data={data.user}/>
                <Outlet />
                {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
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
                <ServerError error={error}/>
                <Scripts />
            </body>
        </html>
    )
}