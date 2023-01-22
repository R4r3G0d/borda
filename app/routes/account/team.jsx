import { useLoaderData, Form } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { TrashIcon } from '@heroicons/react/24/outline'
import { StarIcon, InformationCircleIcon } from '@heroicons/react/24/solid'

import prisma from '~/utils/prisma.server'
import authenticator from '~/utils/auth.server'
import { getSession, commitSession } from '~/utils/session.server'
import { Field } from '~/components/Field'
import { Button } from '~/components'

export async function loader({ request }) {
	try {
		let player = await authenticator.isAuthenticated(request, {
			failureRedirect: '/sign-in',
		})

		// Зачем????
		// if (player.teamId == null) {
		// 	return json({ error: { message: 'Please join a team' } })
		// }
		let team = await prisma.team.findUniqueOrThrow({
			where: {
				id: player.teamId,
			},
			include: {
				// players: {select: {displayName: true}},
				players: true,
			},
		})

		return json({ team, player })

	} catch (err) {
		console.log(err)
		// Также к верхнему зачем???
		// return json({ error: { message: 'Invalid token' } })
		throw err
	}
}

export async function action({ request }) {
	try {
		let user = await authenticator.isAuthenticated(request, {
			failureRedirect: '/sign-in',
		})

		const formData = await request.formData()
		let { _action, ...values } = Object.fromEntries(formData)

		console.log({ _action, values })

		// Зачем???
		// let action = formData.get('_action')

		switch (_action) {
			case 'create': {
				let createdTeam = await prisma.team.create({
					data: {
						name: values.teamName,
						captainId: user.id,
						players: {
							connect: [{ id: user.id }],
						},
					},
				})
				user.team = createdTeam
				user.teamId = createdTeam.id
			}
			case 'join': {
				// TODO:
				//		Проверить не заполнена ли команда
				//		Проверить а не в команде ли уже игрок
				let joinedTeam = await prisma.team.update({
					where: { id: values.teamId },
					data: {
						players: { connect: { id: user.id } },
					},
				})

				user.team = joinedTeam
				user.teamId = joinedTeam.id
			}
			case 'leave': {
				// Что-то странное делается тут
				// Нужно также чтобы игрок из списка игроков удалялся в таблице team!
				await prisma.player.update({
					where: { id: user.id },
					data: { teamId: null },
				})
			}
			case 'kick': {
				// Что-то странное делается тут
				// Тоже самое что в leave
				await prisma.player.update({
					where: {
						id: values.kickId,
					},
					data: {
						teamId: null,
					},
				})
				return redirect('.')
			}
			case 'delete': {
				// Проверить, удаляются ли связи у юзеров с командой!
				await prisma.team.delete({
					where: {
						id: user.teamId,
					},
				})
				user.team = null
			}
		}

		const session = await getSession(request.headers.get('Cookie'))
		session.set(authenticator.sessionKey, user)

		return redirect('/account', { headers: { 'set-cookie': await commitSession(session) } })

	} catch (err) {
		console.log(err)
		throw err
	}

}

export default function TeamSettingsPage() {
	const data = useLoaderData()
	console.log(data.team)

	return (
		<div className='container w-full max-w-2xl mx-auto sm:px-6'>
			<Form
				method='post'
				reloadDocument
				replace
				className='pt-5 pb-10 grid grid-cols-2 gap-5'
			>
				<h2 className='col-span-2 py-2 text-lg text-white border-b border-white/30'>
					Team settings
				</h2>
				{data.team
					? (
						<>
							<Field
								name='teamId'
								label='Team ID'
								disabled
								value={data.team.id}
								className='col-span-2'
							/>
							<Field
								name='teamName'
								label='Team Name'
								disabled
								value={data.team.name}
								className='col-span-2'
							/>
							<Button
								text='Leave team'
								name='_action'
								value='leave'
								className='self-center'
							/>
							<Button
								text='Delete team'
								name='_action'
								value='delete'
								className='self-center'
							/>
							<h2 className='col-span-2 py-2 text-lg text-white border-b border-white/30'>
								Team members
							</h2>
							<table className="col-span-2 table-auto">
								<tbody>
									{data.team.players.map(function (player, index) {
										return (
											<tr key={player.id} className='h-10 whitespace-nowrap border-b  border-white/30 '>
												<td>{index + 1}</td>
												<td className='px-3'>{player.displayName}</td>
												{player.id == data.team.captainId
													? (
														<>
															<td className='px-3'>
																<StarIcon className='w-5 h-5 text-yellow-500' />
															</td>
															<td className='flex justify-end'>
																<input name='teammateId' value={player.id} type='hidden' />
																<Button
																	name='_action'
																	value='kick'
																	icon={TrashIcon}
																	small
																>
																</Button>
															</td>
														</>
													) : null
												}
											</tr>
										)
									})}
								</tbody>
							</table>
						</>
					)
					: (
						<>
							<h3 className='mb-5 flex flex-row font-semibold'>
								<InformationCircleIcon className='w-6 h-6 mr-4' />
								You are't in a team. Please join or create one.
							</h3>
							<div className='flex flex-wrap md:flex-nowrap justify-between '>
								<div className='w-full mr-8 flex flex-col items-start'>
									<Field name='teamName' label='Team Name' />
									<Button text='Create team' name='_action' value='create' />
								</div>

								<div className='w-full flex flex-col items-end'>
									<Field name='teamId' label='Team ID' />
									<Button text='Join team' name='_action' value='join' />
								</div>
							</div>
						</>
					)
				}
			</Form >
		</div >
	)
}
