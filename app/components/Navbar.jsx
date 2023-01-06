import * as React from 'react'
import clsx from 'clsx'
import { NavLink, Link, useLocation } from '@remix-run/react'
import { Menu, Transition, Dialog } from '@headlessui/react'
import {
    ArrowLeftOnRectangleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    ChevronDownIcon,
    Cog6ToothIcon,
    FlagIcon,
    ListBulletIcon,
    SquaresPlusIcon,
    UserCircleIcon,
    UserGroupIcon,
    UserPlusIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'

import { Button } from '~/components/Button'

export function Navbar({ user }) {
    let location = useLocation()

    if (location.pathname.includes('sign') || location.pathname.includes('login')) return null
    return (
        <header
            className={clsx(
                'fixed top-0 z-50 w-full h-14',
                'backdrop-blur-xl backdrop-filter',
                'bg-black bg-opacity-70',
                'border-b border-white border-opacity-25',
                'shadow-xl'
            )}
        >
            <nav className='h-full px-5 flex flex-row items-center justify-between'>
                <NavbarLogo />
                <NavbarMenu />
                <NavbarAccount user={user?.displayName} team={user?.team?.name} />

                <NavbarMobileMenu user={user?.displayName} />
            </nav>
        </header>
    )
}

function NavbarLogo({ className }) {
    return (
        <Link to='/' className={clsx('flex flex-row flex-shrink-0 flex-grow-0 items-center h-full', className)}>
            <SquaresPlusIcon className='w-9 h-9 p-1 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg' />
            <h1 className='ml-4 font-bold text-2xl text-white'>ADMCTF</h1>
        </Link>
    )
}

function NavbarEventSwitcher() {
    return (<div></div>)
}

function NavbarMenu() {
    const links = ['tasks', 'scoreboard', 'users']
    return (
        <div className=' hidden h-14 mt-px sm:flex flex-row text-neutral-300'>
            {links.map((link, id) => (
                <NavLink
                    key={id}
                    to={'/' + link}
                    className={({ isActive }) => clsx(
                        'capitalize px-3 md:px-5 hover:text-white shrink grid place-items-center',
                        { 'text-white border-b border-white': isActive }
                    )}
                >
                    {link}
                </NavLink>
            ))}
        </div>
    )
}

function NavbarMobileMenu({ user }) {
    let baselinks = [
        {
            link: '/tasks',
            text: 'Tasks',
            icon: <FlagIcon className='w-5 h-5' />
        },
        {
            link: '/scoreboard',
            text: 'Scoreboard',
            icon: <ListBulletIcon className='w-5 h-5 text-white' />
        },
        {
            link: '/users',
            text: 'Users',
            icon: <UserGroupIcon className='w-5 h-5' />
        },
    ]

    let userLinks = [
        {
            link: '/account',
            text: 'Account Settings',
            icon: <Cog6ToothIcon className='w-5 h-5' />
        },
        {
            link: '/account/team',
            text: 'Team Settings',
            icon: <UserGroupIcon className='w-5 h-5' />
        },
        {
            link: '/sign-out',
            text: 'Logout',
            icon: <ArrowLeftOnRectangleIcon className='w-5 h-5' />
        },
    ]

    let notUserLinks = [
        {
            link: '/sign-in',
            text: 'Log in',
            icon: <ArrowRightOnRectangleIcon className='w-5 h-5' />
        },
        {
            link: '/sign-up',
            text: 'Sign up',
            icon: <UserPlusIcon className='w-5 h-5' />
        }
    ]

    let links
    if (user) {
        links = baselinks.concat(userLinks)
    } else {
        links = baselinks.concat(notUserLinks)
    }

    let [isOpen, setIsOpen] = React.useState(false)

    return (
        <>
            <Bars3Icon className='w-5 h-5 sm:hidden' onClick={() => setIsOpen(true)} />
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                {/* The backdrop, rendered as a fixed sibling to the panel container */}
                {/* <div className="fixed inset-0 bg-black/30" aria-hidden="true" /> */}

                {/* Full-screen scrollable container */}
                <div className="fixed inset-0 overflow-y-auto">
                    <Dialog.Panel className="min-w-screen min-h-screen bg-black">

                        <div className='flex flex-row justify-between items-center h-14 px-5 border-b border-white border-opacity-25'>
                            <NavbarLogo className='focus:outline-none' />
                            <XMarkIcon className='w-6 h-6 mr-3' onClick={() => setIsOpen(false)} />
                        </div>

                        <div className={clsx("flex flex-col py-2 px-5")}>
                            {links.map((link, index) => (
                                <Link
                                    to={link.link}
                                    key={index}
                                    className='rounded-md hover:bg-blue-600'
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="h-9 px-2 flex flex-row items-center text-neutral-200">
                                        {link.icon}
                                        <div className="normal-case text-sm pl-3">
                                            {link.text}
                                        </div>
                                    </div>
                                </Link>

                            ))}
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    )
}

function NavbarAccount({ team, user }) {
    if (!user) {
        return (
            <div className="hidden sm:flex flex-row ">
                <Link to='/sign-in' className='flex items-center'>
                    <Button text='Log in' small />
                </Link>
                <Link to='/sign-up' className='flex items-center'>
                    <Button text='Sign up' className='ml-3' small />
                </Link>
            </div>
        )
    }

    const links = [
        {
            link: '/account',
            text: 'Account Settings',
            icon: <Cog6ToothIcon className='w-5 h-5' />
        },
        {
            link: '/account/team',
            text: 'Team Settings',
            icon: <UserGroupIcon className='w-5 h-5' />
        },
        {
            link: '/sign-out',
            text: 'Logout',
            icon: <ArrowLeftOnRectangleIcon className='w-5 h-5' />
        },
    ]
    return (
        <Menu as='div' className={'relative hidden sm:block'}>
            <Menu.Button
                className={({ open }) => clsx('flex items-center h-14 text-neutral-300', { 'text-white': open })}
            >
                <div className='flex flex-row items-center justify-between h-full pl-3 mr-3'>
                    <UserCircleIcon className="h-9 w-9" strokeWidth={1} />
                    <div className='w-min ml-4 flex flex-col items-start justify-end'>
                        <div className="text-sm font-semibold whitespace-nowrap">{user}</div>
                        <div className='text-xs whitespace-nowrap'>{team ? team : 'No Team'}</div>
                    </div>
                </div>
                <div className='w-5 h-full flex flex-row justify-center items-center'>
                    <ChevronDownIcon
                        className="w-3 h-3"
                        aria-hidden="true"
                        strokeWidth={1}
                    />
                </div>
            </Menu.Button >

            <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className={clsx(
                    `absolute z-50 mt-2 right-0 w-60 min-w-full rounded-lg  focus:outline-none`,
                    'backdrop-blur-xl backdrop-filter bg-black bg-opacity-90',
                    'border border-white border-opacity-25 shadow-2xl',
                )}
                >
                    <div className={clsx("flex flex-col py-2")}>
                        {links.map((link, index) => (
                            <Menu.Item key={index}>
                                <NavLink
                                    to={link.link}
                                    className={({ isActive }) => clsx('mx-2 rounded-md hover:bg-blue-600', { 'bg-blue-600': isActive })}
                                >
                                    <div className="h-9 px-2 flex flex-row items-center text-neutral-200">
                                        {link.icon}
                                        <div className="normal-case text-sm pl-3">
                                            {link.text}
                                        </div>
                                    </div>
                                </NavLink>
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu >
    );
}