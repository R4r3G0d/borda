import { NavLink, Outlet } from "@remix-run/react"
import clsx from "clsx"

export default function () {
    const links = [
        {
            path: '.',
            text: 'Settings',
        },
        {
            path: './team',
            text: 'Team',
        }
    ]

    return (
        <>
            <div className='fixed top-14 left-0 w-full h-12 bg-white'>
                <div className="absolute h-12 flex flex-row items-center px-5">
                    {links.map((link) => (
                        <NavLink
                            to={link.path}
                            end
                            key={link.text}
                            className={({ isActive }) =>
                                clsx('h-full px-5 border-b flex flex-row items-center text-center', { 'border-black': isActive })
                            }
                        >
                            {link.text}
                        </NavLink>
                    ))}

                </div>
                <div className='h-full w-full border-b'></div>
            </div>
            <div className='pt-12'>
                <Outlet />
            </div>
        </>
    )
}