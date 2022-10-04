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
        <div className='grow mt-5 w-full overflow-auto h-96'>
            <table class="table-auto">
                {/* <thead>
                        <tr>
                            <th>Name</th>
                            <th>Team</th>
                        </tr>
                    </thead> */}
                <tbody>
                    {data.user.map((user) => (
                        <tr className='h-10 whitespace-nowrap'>
                            <td className='px-3'>{user.displayName}</td>
                            <td className='px-3'>{user.team? user.team.name: "no team"}</td> 
                           
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
} 

