import { useLoaderData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import prisma from "~/utils/prisma.server";
import authenticator from "~/utils/auth.server";
import { Button } from "~/components/Button";
import {Field} from "~/components/Field";

export async function loader({ request }) {
  try {
    let player = await authenticator.isAuthenticated(request, {
      failureRedirect: "/sign-in",
    });

    if (player.teamId == null) {
      return json({ error: { message: "Please join a team" } });
    }
    let team = await prisma.team.findUniqueOrThrow({
      where: {
        id: player.teamId,
      },
      include: {
        // players: {select: {displayName: true}},
        players: true,
      },
    });

    console.log(team);
    return json({ team, player });
  } catch (error) {
    return json({ error: { message: "Invalid token" } });
  }
}

export async function action({ request }) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in",
  });
  const formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);
  let action = formData.get("_action");

  try {
    switch (action) {
      case "joinTeam": {
        let newTeam = await prisma.team.update({
          where: {
            id: values.teamId,
          },
          data: {
            players: {
              connect: [{ id: user.id }],
            },
          },
        });
        //console.log(user);
        user.team = newTeam;
        user.teamId=newTeam.id
        const session = await getSession(request.headers.get("Cookie"));
        session.set(authenticator.sessionKey, user);
        console.log(12)
        
        //console.log(user);
        return redirect("/account", {
          headers: { "set-cookie": await commitSession(session) },
        });
      }
      case "leaveTeam": {
        await prisma.player.update({
          where: {
            id: user.id,
          },
          data: {
            teamId: null,
          },
        });

        const session = await getSession(request.headers.get("Cookie"));
        session.set(authenticator.sessionKey, name);
        return redirect("/account", {
          headers: { "Set-Cookie": await commitSession(session) },
        });
      }
      case "createTeam": {
        let newTeam = await prisma.team.create({
          data: {
            name: values.teamName,
            captainId: user.id,
            players: {
              connect: [{ id: user.id }],
            },
          },
        });
        user.team = null;
        user.teamId=null
        const session = await getSession(request.headers.get("Cookie"));
        return redirect("/account", {
          headers: { "set-cookie": await commitSession(session) },
        });
      }
      case "kickFromTheTeam": {
        await prisma.player.update({
          where: {
            id: values.kickId,
          },
          data: {
            teamId: null,
          },
        });
        return null;
      }
      case "deleteTeam": {
        await prisma.team.delete({
          where: {
            id: user.teamId,
          },
        });
        user.team = null;
        const session = await getSession(request.headers.get("Cookie"));
        session.set(authenticator.sessionKey, user);
        return redirect("/account", {
          headers: { "set-cookie": await commitSession(session) },
        });
      }
    }
  } catch {
    return null;
  }
}

export default function AccountTeam() {
  const data = useLoaderData();
  console.log(data);

  //container w-full max-w-2xl mx-auto sm:px-6

  return (
    <>
      <div className="container w-full max-w-2xl mx-auto sm:px-6">
        <h2 className="py-4 text-2xl text-gray-900  border-b border-gray-300">
          Team Setting
        </h2>
      </div>
      {data?.error ? (
        <div className="container w-full max-w-2xl mx-auto sm:px-6 ">
          <div>
            <div className="w-full max-w-2xl flex-row justify-between">
              <Form method="post" className="flex flex-wrap  justify-end py-5">
                <Field name="teamId" label="Invite code" />
                <Button text="Join team" />
                <input name="_action" value="joinTeam" type="hidden" />
              </Form>
            </div>
            <div div className="w-full max-w-2xl flex-row justify-between">
              <Form method="post" className="flex flex-wrap  justify-end py-5">
                <Field name="teamName" label="Name of your team" />
                <Button text="Create team " />
                <input name="_action" value="createTeam" type="hidden" />
              </Form>
            </div>
          </div>
          <div className="bg-red-100 text-red-500 rounded-md h-10 flex items-center w-full">
            <p>You are't in a team. Please join one.</p>
          </div>
        </div>
      ) : (
        <div className="container w-full max-w-2xl mx-auto sm:px-6 ">
          {data.player.id === data.team.captainId ? ( // Если ты кэп то можешь кикать игроков
            <div className="container w-full max-w-2xl mx-auto sm:px-6">
              <h1>Your team is {data.player.team.name}</h1>
              <h1>Invite code is - {data.team.id}</h1>
              <div>
                Your teammaets are:
                {data.team.players.map((o) => {
                  if (o.id == data.team.captainId) {
                    return (
                      <li className="font-bold">{o.displayName} - captain</li>
                    );
                  }
                  return (
                    <>
                      <Form method="post" reloadDocument>
                        <li className="flex">
                          {o.displayName}
                          <div className="w3-container w3-center flex">
                            <Button text="Kick" />
                            <input
                              name="_action"
                              type="hidden"
                              value="kickFromTheTeam"
                            />
                            <input name="kickId" value={o.id} type="hidden" />
                          </div>
                        </li>
                      </Form>
                    </>
                  );
                })}
              </div>

              <Form method="post">
                <Button text="Delete team" className="justify-between" />
                <input name="_action" type="hidden" value="deleteTeam" />
              </Form>
            </div>
          ) : (
            // Ты можешь только ливнуть как обиженка(((
            <div>
              <h1>Your team is {data.player.team.name}</h1>
              <h1>Invite code is - {data.team.id}</h1>
              <h1>
                Your teammaets are{" "}
                {data.team.players.map((o) => {
                  if (o.id == data.team.captainId) {
                    return (
                      <li className="font-bold">{o.displayName} - captain</li>
                    );
                  }
                  return <li>{o.displayName}</li>;
                })}
              </h1>
              <Form method="post">
                <Button text="Left the team" />
                <input name="_action" type="hidden" value="leaveTeam" />
              </Form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
