import { NavLink, Outlet } from "@remix-run/react"
import clsx from "clsx"

import authenticator from '~/utils/auth.server'

export async function loader({ request }) {
    return await authenticator.isAuthenticated(request, {
        failureRedirect: '/sign-in',
    })
}

const links = [
    {
        path: '.',
        text: 'Settings',
    },
    {
        path: './team',
        text: 'Team',
    }
]

export default function () {
    return (
        <>
            <div className={clsx(
                "sticky top-14 left-0 h-14 w-full flex flex-row items-center px-5",
                'border-b border-white/25',
                'backdrop-blur-xl backdrop-filter',
                'bg-black bg-opacity-30',)}>
                {links.map((link) => (
                    <NavLink
                        to={link.path}
                        end
                        key={link.text}
                        className={({ isActive }) =>
                            clsx('h-14 px-5 mt-px border-b border-white/0 flex flex-row items-center text-center', { 'border-white/75': isActive })
                        }
                    >
                        {link.text}
                    </NavLink>
                ))}
            </div>
            <div className='pt-14'>
                <Outlet />
            </div>
        </>
    )
}