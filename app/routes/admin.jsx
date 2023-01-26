import { NavLink, Outlet } from "@remix-run/react"
import clsx from "clsx"
import { useLoaderData, Form } from '@remix-run/react'
import { json, redirect, Response } from '@remix-run/node'
import {Role} from '@prisma/client'

import authenticator from '~/utils/auth.server'
import { response } from "express"

export async function loader({ request }) { 
        let player = await authenticator.isAuthenticated(request, {
			failureRedirect: '/sign-in',
		})

        let isAdmin = player.role == Role.ADMIN

    if (!isAdmin){ //Change
        throw new Response("", { status: 404 });
        }
    
    return json({Ok: true})
}

export default function(){
    let links = [
        {
            path: './settings',
            text: 'Settings',
        },
        {
            path: './tasks',
            text: 'Tasks',
        },
        {
            path: './players',
            text: 'Players',
        }
    ]

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