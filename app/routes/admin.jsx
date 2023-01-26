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
    return (
        <div className="text-white pt-14" > admin panelka <Outlet/></div>
    )
}