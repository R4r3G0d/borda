import * as React from 'react'
import { useLoaderData, Link } from '@remix-run/react'
import { json } from '@remix-run/node'
import { TypeAnimation } from 'react-type-animation'
import moment from 'moment-timezone'
import { ArrowSmallRightIcon } from '@heroicons/react/24/outline'

import { MakaraIcon } from '~/components/icons/MakaraIcon'

import {
    Button,
    CountdownTimer
} from '~/components'

import authenticator from '~/utils/auth.server'
import prisma from '~/utils/prisma.server'

export async function action({ request }) {
    return await authenticator.logout(request, { redirectTo: '/sign-in', })
}

export async function loader({ request }) {
    let player = await authenticator.isAuthenticated(request)
    let event = await prisma.event.findUnique({ where: { id: 1 } })

    return json({ player, event })
}

export default function IndexPage() {
    const { event } = useLoaderData()
    const eventTime = moment.tz(event.startDate, "Europe/Moscow").format('D MMM YYYY, HH:mm')
    const eventUTCTime = moment.utc(event.startDate).format()

    return (
        <div className='container max-w-5xl mx-auto pt-14'>
            <div className='grid gap-5 content-center grid-cols-1 px-5 pb-16'>
                <div className=' w-full'>
                    <div className='absolute -z-10 left-0 w-full h-full max-h-2vh overflow-hidden'>
                        <div className='relative will-change-transform-opacity scale-105  opacity-100'>
                            <img
                                alt=''
                                src="/images/Hero.png"
                                decoding="async"
                                data-nimg="fill"
                                className='w-full h-full inset-0 object-cover'
                            />
                        </div>
                    </div>
                    {/* Mobile */}
                    {/* <div className='col-span-2 w-full'>
                    <img
                        alt=''
                        src="/images/hero-mobile.png"
                        decoding="async"
                        data-nimg="fill"
                        className='md:hidden w-screen h-full object-cover'
                    />
                </div> */}
                    <div className='flex items-center justify-between'>
                        <div className="z-30 w-full max-h-800 md:min-h-600 md:h-8vh m-auto py-5 grid justify-items-center content-start md:content-center gap-5 flex-1">
                            <TypeAnimation
                                sequence={[
                                    '',
                                    1000,
                                    'Admiral',
                                    1000,
                                    'Admiral Makarov',
                                    1000,
                                    'Admiral Makarov CTF',
                                    1000,
                                    'Admiral Makarov CTF 2022',
                                    1000,
                                ]}
                                speed={50}
                                className='text-center text-2xl sm:text-4xl px-20 sm:px-40 h-24 md:h-48 md:px-20 md:text-8xl text-transparent select-none font-bold bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500'
                                wrapper='h1'
                                repeat={Infinity}
                            />

                            <CountdownTimer time={event.startDate} className='text-center' />
                            <div className='text-center'>
                                <p className='tracking-wide font-semibold text-transparent whitespace-pre-wrap bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500'>
                                    {eventTime} (GMT+3, UTC+03:00)
                                </p>
                                <p className='mt-2 tracking-widest text-white/70  whitespace-pre-wrap'>{eventUTCTime}</p>
                            </div>
                            <Link to='/tasks' className='flex justify-center'>
                                <Button text='Play' />
                            </Link>
                        </div>
                    </div>

                </div>




                <div className='col-span-full flex flex-col md:flex-row rounded-3xl overflow-hidden bg-blue-500'>
                    <div className='md:w-1/2 p-8 text-white flex flex-col'>
                        <h3 className='mt-auto text-2xl font-semibold'>Sponsor</h3>
                        <p className='mt-1 text-base'>Admiral Makarov State University of Maritime and Inland Shipping</p>
                        <a href='https://gumrf.ru/en/' className='mt-auto'>
                            <Button
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
                <Event />
            </div>
        </div>
    )
}

function Event({ event, className }) {
    <div className='flex-col md:flex-row rounded-3xl overflow-hidden bg-blue-500'>
        <div className='md:w-1/2 p-8 text-white flex flex-col'>
            <h3 className='mt-auto text-2xl font-semibold'>Sponsor</h3>
            <p className='mt-1 text-base'>Admiral Makarov State University of Maritime and Inland Shipping</p>
            <a href='https://gumrf.ru/en/' className='mt-auto'>
                <Button
                    text={
                        <span className='flex flex-row items-center'>
                            Play
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
}