import { NavLink, Outlet } from "@remix-run/react"
import clsx from "clsx"
import { useLoaderData, Form } from '@remix-run/react'
import { json, redirect, Response } from '@remix-run/node'
import { Role } from '@prisma/client'

import authenticator from '~/utils/auth.server'

export async function loader({ request }) {
    let player = await authenticator.isAuthenticated(request, {
        failureRedirect: '/sign-in',
    })

    let isAdmin = player.role == Role.ADMIN

    if (!isAdmin) {
        throw new Response("", { status: 404 });
    }

    return new Response("", { status: 200 })
}

export default function () {
    let routes = [
        {
            path: './players',
            name: 'Players',
        },
        {
            path: './tasks',
            name: 'Tasks',
        },
        {
            path: './settings',
            name: 'Settings',
        }
    ]

    return (
        <div className=' pt-14 w-full'>
            <div className="min-h-screen text-white flex flex-row">
                <div className="sticky flex-none grid grid-cols-1 gap-5 min-w-max h-fit">
                    {
                        routes.map((route, idx) => (
                            <NavLink
                                to={route.path}
                                key={idx}
                                className={({ isActive }) =>
                                    clsx('text-white p-5', { 'bg-blue-600': isActive })
                                }
                            >
                                {route.name}
                            </NavLink>
                        ))
                    }
                </div>
                <Outlet />
            </div>
        </div>
    )
}