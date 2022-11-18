import * as React from 'react'
import { useLoaderData, Link } from '@remix-run/react'
import { json } from '@remix-run/node'
import { TypeAnimation } from 'react-type-animation'
import moment from 'moment-timezone'
import { ArrowSmallRightIcon } from '@heroicons/react/24/outline'

import { MakaraIcon } from '~/components/icons/MakaraIcon'
import { Button } from '~/components/Button'
import { CountdownTimer } from '~/components/Timer'

import authenticator from '~/utils/auth.server'
import prisma from '~/utils/prisma.server'

export async function action({ request }) {
    return await authenticator.logout(request, { redirectTo: '/sign-in', })
}

export async function loader({ request }) {
    try {
        let player = await authenticator.isAuthenticated(request)

        let event = await prisma.event.findUnique({ where: { id: 1 } })

        return json({ player, event })

    } catch (err) {
        console.log(err)
        throw err
    }
}

export default function IndexPage() {
    const { event } = useLoaderData()
    const eventTime = moment.tz(event.startDate, "Europe/Moscow").format('D MMM YYYY, HH:mm')
    const eventUTCTime = moment.utc(event.startDate).format()

    return (
        <div className='container min-h-screen max-w-5xl mx-auto pt-12'>
            <div className='grid gap-5 content-center md:grid-cols-2 px-5 pb-16'>
                <div className='md:col-span-full'>
                    <div className='absolute -z-10 left-0 w-full h-full overflow-hidden'>
                        <img
                            alt=''
                            sizes="100vw"
                            src="/images/Hero.png"
                            decoding="async"
                            data-nimg="fill"
                            className='w-full h-auto object-cover'
                        />
                    </div>

                    <div className="z-30 md:h-8vh p-5 mt-5 m-auto text-center grid flex-1 gap-4 justify-center">
                        <TypeAnimation
                            sequence={[
                                '',
                                1000,
                                'admiral',
                                1000,
                                'admiral Makarov',
                                1000,
                                'admiral Makarov CTF',
                                1000,
                                'admiral Makarov CTF 2022"',
                                1000,
                            ]}
                            speed={50}
                            className='h-52 max-w-xs md:max-w-full px-5 text-3xl sm:text-5xl md:text-8xl text-transparent select-none whitespace-pre-wrap min-w-0 font-bold bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500'
                            wrapper='h1'
                            repeat={Infinity}
                        />
                        <CountdownTimer time={event.startDate} className='justify-self-center' />
                        <div>
                            <p className='text-lg tracking-wide font-semibold text-transparent whitespace-pre-wrap bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500'>
                                {eventTime} (GMT+3, UTC+03:00)
                            </p>
                            <p className='mt-2 tracking-widest text-gray-400 font-mono font-extralight whitespace-pre-wrap'>{eventUTCTime}</p>
                        </div>
                        <Link to='/tasks' className='flex justify-center'>
                            <Button text='Start playing now' />
                        </Link>
                    </div>
                </div>

                <div className='my-20 md:col-span-full flex flex-col md:flex-row rounded-3xl overflow-hidden bg-blue-500'>
                    <div className='md:w-1/2 p-8 text-white flex flex-col'>
                        <h3 className='mt-auto text-2xl font-semibold'>Sponsor</h3>
                        <p className='mt-1 text-base'>Admiral Makarov State University of Maritime and Inland Shipping</p>
                        <a href='https://gumrf.ru/en/' className='mt-auto'>
                            <Button
                                className=''
                                text={
                                    <span className='flex flex-row items-center'>
                                        Visit website
                                        <ArrowSmallRightIcon className='w-5 h-5 ml-5' />
                                    </span>
                                }
                            />
                        </a>
                    </div>
                    <div className='md:w-1/2 flex justify-center p-8'>
                        <MakaraIcon className='w-72 h-72' />
                    </div>
                </div>
            </div>
        </div>
    )
}