import { NavLink, Outlet } from "@remix-run/react"
import clsx from "clsx"
import { useLoaderData, Form } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'

import authenticator from '~/utils/auth.server'

export async function loader({ request }) {
    try {
        let user = await authenticator.isAuthenticated(request, {
            failureRedirect: '/sign-in',
        })

        return json({ user })

    } catch (err) {
        console.log(err)
        // Также к верхнему зачем???
        // return json({ error: { message: 'Invalid token' } })
        throw err
    }
}

export default function () {
    let links = [
        {
            path: '.',
            text: 'Settings',
        },
        {
            path: './team',
            text: 'Team',
        }
    ]
    const { user } = useLoaderData()
    if (user.role == 'ADMIN') { links.push({ path: './event', text: 'Manage CTF' }) }

    return (
        <>
            <div className={clsx(
                "sticky top-14 left-0 h-12 w-full flex flex-row items-center px-5",
                'border-b border-white/25',
                'backdrop-blur-xl backdrop-filter',
                'bg-black bg-opacity-30',)}>
                {links.map((link) => (
                    <NavLink
                        to={link.path}
                        end
                        key={link.text}
                        className={({ isActive }) =>
                            clsx('h-12 px-5 mt-px border-b border-white/0 flex flex-row items-center text-center', { 'border-white/75': isActive })
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