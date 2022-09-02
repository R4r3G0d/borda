import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
    useCatch
} from "@remix-run/react";
import { FourOhFour, ServerError } from "./components/Errors";
import Header from "./components/Header";
import styles from "./styles/tailwind.css";

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

export default function App() {
    const location = useLocation()
    console.log(location)

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
                {location.pathname !== "/" && location.pathname !== "/login" ? (<Header />) : null}
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

// export function ErrorBoundary({ error }) {
//     console.error(error)
//     const location = useLocation()
//     return (
//         <html lang="en" className="dark">
//             <head>
//                 <title>Oh no...</title>
//                 <Links />
//             </head>
//             <body className="bg-white transition duration-500 dark:bg-gray-900">
//                 <ServerError error={erorr}/>
//                 <Scripts />
//             </body>
//         </html>
//     )
// }