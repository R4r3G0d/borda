import { useLoaderData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import prisma from "~/utils/prisma.server";
import authenticator from "~/utils/auth.server";

export async function loader({ request }) {
  let player = await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in",
  });

  if (player.teamId === null) {
    return json({ error: { message: "Please join a team" } });
  }

  try {
    let teammates = await prisma.team.findMany({
      where: {
        id: player.teamId,
      },
      include: {
        players: player.displayName,
      },
    });

    console.log(teammates);
    return json({ teammates, player });
  } catch (error) {
    return json({ error: { message: "Invalid token" } });
  }
}




export async function action({ request }) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in",
  });
  const formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData)
  let action = formData.get("_action");

  switch (action) {
    case "joinTeam": {
      try {
        await prisma.team.update({
          where: {
            id: values.teamId,
          },
          data: {
            players: {
              connect: [{ id: user.id }],
            },
          },
        });
      } catch (error) {
        console.log({ error });
        return json({ error: { message: "Not valid invite code" } });
      }
    }
    case "leaveTeam": {
      try {
        await prisma.player.update({
          where: {
            id: user.id,
          },
          data: {
            teamId: null,
          },
        });
        return redirect("./");
      } catch (error) {
        console.log({ error });
        return json({ error: { message: "Not valid invite code" } });
      }
    }
    case "createTeam": {
      try {
        await prisma.team.create({
          data: {
            name: values.teamName,
            captainId: user.id,
            players: {
              connect: [{ id: user.id }],
            },
          },
        });
        return redirect("./");
      } catch (error) {
        console.log({ error });
        return json({ error: { message: "Not valid invite code" } });
      }
    }
    case "kickFromTheTeam": {
      try {
        await prisma.player.update({
          where: {
            id: values.kickId,
          },
          data: {
            teamId: null,
          },
        });
        return null;
      } catch (error) {
        console.log({ error });
        return json({ error: { message: "Not valid invite code" } });
      }
    }
    case "deleteTeam": {
      try {
        await prisma.team.delete({
          where: {
            id: user.teamId,
          },
        });
        // user.team=null;
        // const session = await getSession(request.headers.get('Cookie'))
        // session.set(authenticator.sessionKey, user)
        // return redirect('/account', { headers: { 'set-cookie': await commitSession(session) } })

      } catch (error) {
        console.log({ error });
        return json({ error: { message: "Not valid invite code" } });
      }
    }
  }
}

export default function AccountTeam() {
  const data = useLoaderData();
  console.log(data);

  return (
    <>
      <div className="capitalize mt-5">team settings</div>
      {data?.error ? (
        <div className="pb-2">
          <div className="bg-red-100 text-red-500 rounded-md h-10 flex items-center w-full">
            <p className="px-3">You are't in a team. Please join one.</p>
          </div>
          <div>
            <Form method="post">
              <button
                type="submit"
                class="bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md"
              >
                Join Team
              </button>

              <input name="_action" value="joinTeam" type="hidden" />
              <input name="teamId" />
            </Form>
            <Form method="post">
              <button
                type="submit"
                class="bg-gray-200 text-gray-900 px-2 py-1 shadow-sm border border-gray-400 rounded-md"
              >
                Create team
              </button>
              <input name="_action" value="createTeam" type="hidden" />
              <input name="teamName" />
            </Form>
          </div>
        </div>
      ) : (
        <div>
          {data.player.id === data.teammates[0].captainId ? ( // Если ты кэп то можешь кикать игроков
            <div className="w-64">
              <h1>Ur team is {data.player.team.name}</h1>
              <h1>Invite code is - {data.teammates[0].id}</h1>
              <div>
                Ur teammaets are{" "}
                {data.teammates[0].players.map((o) => {
                  if (o.id == data.teammates[0].captainId) {
                    return (
                      <li className="font-bold">{o.displayName} - captain</li>
                    );
                  }
                  return (
                    <>
                      <Form method="post" reloadDocument>
                        <li>
                          {o.displayName}
                          <span className="w3-container w3-center">
                            <button className="pl-4">Kick</button>
                            <input
                              name="_action"
                              type="hidden"
                              value="kickFromTheTeam"
                            />
                            <input name="kickId" value={o.id} type="hidden" />
                          </span>
                        </li>
                      </Form>
                    </>
                  );
                })}
              </div>
              <div></div>
              <Form method="post">
                <button>delete team</button>
                <input name="_action" type="hidden" value="deleteTeam" />
              </Form>
            </div>
          ) : (
            // Ты можешь только ливнуть как обиженка(((
            <div>
              <h1>Ur team is {data.player.team.name}</h1>
              <h1>Invite code is - {data.teammates[0].id}</h1>
              <h1>
                Ur teammaets are{" "}
                {data.teammates[0].players.map((o) => {
                  if (o.id == data.teammates[0].captainId) {
                    return (
                      <li className="font-bold">{o.displayName} - captain</li>
                    );
                  }
                  return <li>{o.displayName}</li>;
                })}
              </h1>
              <div></div>
              <Form method="post">
                <button>Left the team</button>
                <input name="_action" type="hidden" value="leaveTeam" />
              </Form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
