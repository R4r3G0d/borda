import * as React from 'react'
import { Link, useLoaderData } from "@remix-run/react";
import authenticator from '~/utils/auth.server';
import prisma from '~/utils/prisma.server';
import { json } from '@remix-run/node';



export async function loader({ params }) {
    let user = await prisma.player.findMany({        
        include: {
            team: true,
        },
    })

    return json({ user })
}

export default function(){
    let data = useLoaderData()
    console.log(data)
    // return(<div>123</div>)
    return (
        <div className='grow mt-5 w-full overflow-auto flex items-stretch md:items-center content-center'>
            <table className="table-auto shadow-lg bg-white border-separate">
                { <thead>
                        <tr>
                            <th className='bg-blue-100 border text-left px-8 py-4'>Name</th>
                            <th className='bg-blue-100 border text-left px-8 py-4'>Team</th>
                        </tr>
                    </thead> }
                <tbody>
                    {data.user.map((user) => (
                        <tr className='h-10 whitespace-nowrap'>
                            <td className='border px-8 py-4'>
                                <span>{user.displayName}</span>
                            </td>
                            <td className='border px-8 py-4'>
                                <span>{user.team? user.team.name: "no team"}</span>
                            </td> 
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
} 

