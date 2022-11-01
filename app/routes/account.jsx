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
    const { user } = useLoaderData()
    return (
        <>

            <div className='fixed top-14 left-0 w-full h-12 bg-white'>
                <div className="absolute h-12 flex flex-row items-center px-5">
                    {links.map((link) => (
                        <NavLink
                            to={link.path}
                            end
                            key={link.text}
                            className={({ isActive }) =>
                                clsx('h-full px-5 border-b flex flex-row items-center text-center', { 'border-black': isActive })
                            }
                        >
                            {link.text}
                        </NavLink>
                    ))}
                    {user.role == 'ADMIN' ?
                        <NavLink
                            to={'./event'}
                            end
                            className={({ isActive }) =>
                                clsx('h-full px-5 border-b flex flex-row items-center text-center', { 'border-black': isActive })
                            }
                        >
                            Admin
                        </NavLink> : null}

                </div>
                <div className='h-full w-full border-b'></div>
            </div>
            <div className='pt-12 px-5'>
                <Outlet />
            </div>
        </>
    )
}