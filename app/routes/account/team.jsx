import { useLoaderData } from "@remix-run/react";
import authenticator from '~/utils/auth.server';
import prisma from '~/utils/prisma.server';
import { json } from "@remix-run/node";
import { map } from "zod";

export let loader = async ({ request }) => {
    let player = await authenticator.isAuthenticated(request, {
        failureRedirect: "/sign-in"
    });

    let teammates = await prisma.team.findMany({
        where: {
            id: player.teamId,
        },
        include: {
            players: player.displayName
        }
    });
    console.log(teammates);
    return json({ teammates, player });

}




export default ({ }) => {
    const data = useLoaderData();


    const newData = data.teammates[0].players
    const result = newData.filter(o => o.id == data.teammates[0].captainId)
    console.log(result)
    return (
        <>
            <div className='capitalize mt-5'>team settings</div>
            {data.player.team == null ? (
                <div className='pb-2'>
                    <div className='bg-red-100 text-red-500 rounded-md h-10 flex items-center w-full'>
                        <p className='px-3'>
                            u arnot in team
                        </p>
                    </div>

                </div>
            ) : <div><h1>Ur team is {data.player.team.name}</h1>
                <h1>Ur teammates are: {data.teammates[0].players.map(o => { if (o.id == data.teammates[0].captainId) { return <li className="font-bold">{o.displayName} - captain</li> } return <li>{o.displayName}</li> })}</h1></div>}
            <div className='h-16'></div>
            {/* {data.teammates[0].players.map(o => { if (o.id == data.teammates[0].captainId) { return <li className="font-bold">{o.displayName} - captain</li> } return <li>{o.displayName}</li> })} */}



        </>
    )
}